"""
Query related functions.
"""
import logging
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

import duckdb
import snowflake.connector
import sqlparse
from sqlalchemy import create_engine, text
from sqlmodel import Session, select

from djqs.config import Settings
from djqs.constants import SQLALCHEMY_URI
from djqs.models.engine import Engine, EngineType
from djqs.models.query import (
    ColumnMetadata,
    Query,
    QueryResults,
    QueryState,
    Results,
    StatementResults,
)
from djqs.typing import ColumnType, Description, SQLADialect, Stream, TypeEnum

_logger = logging.getLogger(__name__)


def get_columns_from_description(
    description: Description,
    dialect: SQLADialect,
) -> List[ColumnMetadata]:
    """
    Extract column metadata from the cursor description.

    For now this uses the information from the cursor description, which only allow us to
    distinguish between 4 types (see ``TypeEnum``). In the future we should use a type
    inferrer to determine the types based on the query.
    """
    type_map = {
        TypeEnum.STRING: ColumnType.STR,
        TypeEnum.BINARY: ColumnType.BYTES,
        TypeEnum.NUMBER: ColumnType.FLOAT,
        TypeEnum.DATETIME: ColumnType.DATETIME,
    }

    columns = []
    for column in description or []:
        name, native_type = column[:2]
        for dbapi_type in TypeEnum:
            if native_type == getattr(
                dialect.dbapi,
                dbapi_type.value,
                None,
            ):  # pragma: no cover
                type_ = type_map[dbapi_type]
                break
        else:
            # fallback to string
            type_ = ColumnType.STR  # pragma: no cover

        columns.append(ColumnMetadata(name=name, type=type_))

    return columns


def run_query(  # pylint: disable=R0914
    session: Session,
    query: Query,
    headers: Optional[Dict[str, str]] = None,
) -> List[Tuple[str, List[ColumnMetadata], Stream]]:
    """
    Run a query and return its results.

    For each statement we return a tuple with the statement SQL, a description of the
    columns (name and type) and a stream of rows (tuples).
    """

    _logger.info("Running query on catalog %s", query.catalog_name)

    engine = session.exec(
        select(Engine)
        .where(Engine.name == query.engine_name)
        .where(Engine.version == query.engine_version),
    ).one()

    query_server = headers.get("SQLALCHEMY_URI") if headers else None

    if query_server:
        _logger.info(
            "Creating sqlalchemy engine using request header param %s",
            SQLALCHEMY_URI,
        )
        sqla_engine = create_engine(query_server)
    elif engine.type == EngineType.DUCKDB:
        _logger.info("Creating duckdb connection")
        conn = (
            duckdb.connect()
            if engine.uri == "duckdb:///:memory:"
            else duckdb.connect(
                database=engine.extra_params["location"],
                read_only=True,
            )
        )
        return run_duckdb_query(query, conn)
    elif engine.type == EngineType.SNOWFLAKE:
        _logger.info("Creating snowflake connection")
        conn = snowflake.connector.connect(
            **engine.extra_params,
            password=os.getenv("SNOWSQL_PWD"),
        )
        cur = conn.cursor()

        return run_snowflake_query(query, cur)

    _logger.info(
        "Creating sqlalchemy engine using engine name and version defined on query",
    )
    sqla_engine = create_engine(engine.uri, connect_args=engine.extra_params)
    connection = sqla_engine.connect()

    output: List[Tuple[str, List[ColumnMetadata], Stream]] = []
    statements = sqlparse.parse(query.executed_query)
    for statement in statements:
        # Druid doesn't like statements that end in a semicolon...
        sql = str(statement).strip().rstrip(";")

        results = connection.execute(text(sql))
        stream = (tuple(row) for row in results)
        columns = get_columns_from_description(
            results.cursor.description,
            sqla_engine.dialect,
        )
        output.append((sql, columns, stream))

    return output


def run_duckdb_query(
    query: Query,
    conn: duckdb.DuckDBPyConnection,
) -> List[Tuple[str, List[ColumnMetadata], Stream]]:
    """
    Run a duckdb query against the local duckdb database
    """
    output: List[Tuple[str, List[ColumnMetadata], Stream]] = []
    rows = conn.execute(query.submitted_query).fetchall()
    columns: List[ColumnMetadata] = []
    output.append((query.submitted_query, columns, rows))
    return output


def run_snowflake_query(
    query: Query,
    cur: snowflake.connector.cursor.SnowflakeCursor,
) -> List[Tuple[str, List[ColumnMetadata], Stream]]:
    """
    Run a query against a snowflake warehouse
    """
    output: List[Tuple[str, List[ColumnMetadata], Stream]] = []
    rows = cur.execute(query.submitted_query).fetchall()
    columns: List[ColumnMetadata] = []
    output.append((query.submitted_query, columns, rows))
    return output


def process_query(
    session: Session,
    settings: Settings,
    query: Query,
    headers: Optional[Dict[str, str]] = None,
) -> QueryResults:
    """
    Process a query.
    """
    query.scheduled = datetime.now(timezone.utc)
    query.state = QueryState.SCHEDULED
    query.executed_query = query.submitted_query

    errors = []
    query.started = datetime.now(timezone.utc)
    try:
        root = []
        for sql, columns, stream in run_query(
            session=session,
            query=query,
            headers=headers,
        ):
            rows = list(stream)
            root.append(
                StatementResults(
                    sql=sql,
                    columns=columns,
                    rows=rows,
                    row_count=len(rows),
                ),
            )
        results = Results(__root__=root)

        query.state = QueryState.FINISHED
        query.progress = 1.0
    except Exception as ex:  # pylint: disable=broad-except
        results = Results(__root__=[])
        query.state = QueryState.FAILED
        errors = [str(ex)]

    query.finished = datetime.now(timezone.utc)

    session.add(query)
    session.commit()
    session.refresh(query)

    settings.results_backend.add(str(query.id), results.json())

    return QueryResults(results=results, errors=errors, **query.dict())
