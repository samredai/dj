# pylint: disable=too-many-public-methods
"""DataJunction main client module."""

import time
from typing import List, Optional, Set, Union
from urllib.parse import urlencode

from alive_progress import alive_bar

from datajunction import _internal, models
from datajunction.exceptions import DJClientException, DJTagDoesNotExist
from datajunction.nodes import Cube, Dimension, Metric, Source, Transform
from datajunction.tags import Tag


class DJClient(_internal.DJClient):
    """
    Client class for basic DJ dag and data access.
    """

    #
    # List basic objects: namespaces, dimensions, metrics, cubes
    #
    def list_namespaces(self, prefix: Optional[str] = None) -> List[str]:
        """
        List namespaces starting with a given prefix.
        """
        namespaces = self._session.get("/namespaces/").json()
        namespace_list = [n["namespace"] for n in namespaces]
        if prefix:
            namespace_list = [n for n in namespace_list if n.startswith(prefix)]
        return namespace_list

    def list_dimensions(self, namespace: Optional[str] = None) -> List[str]:
        """
        List dimension nodes for a given namespace or all.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=models.NodeType.DIMENSION,
            )
        return self._get_all_nodes(type_=models.NodeType.DIMENSION)

    def list_metrics(self, namespace: Optional[str] = None) -> List[str]:
        """
        List metric nodes for a given namespace or all.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=models.NodeType.METRIC,
            )
        return self._get_all_nodes(type_=models.NodeType.METRIC)

    def list_cubes(self, namespace: Optional[str] = None) -> List[str]:
        """
        List cube nodes for a given namespace or all.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=models.NodeType.CUBE,
            )
        return self._get_all_nodes(type_=models.NodeType.CUBE)

    #
    # List other nodes: sources, transforms, all.
    #
    def list_sources(self, namespace: Optional[str] = None) -> List[str]:
        """
        List source nodes for a given namespace or all.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=models.NodeType.SOURCE,
            )
        return self._get_all_nodes(type_=models.NodeType.SOURCE)

    def list_transforms(self, namespace: Optional[str] = None) -> List[str]:
        """
        List transform nodes for a given namespace or all.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=models.NodeType.TRANSFORM,
            )
        return self._get_all_nodes(type_=models.NodeType.TRANSFORM)

    def list_nodes(
        self,
        type_: Optional[models.NodeType] = None,
        namespace: Optional[str] = None,
    ) -> List[str]:
        """
        List any nodes for a given node type and/or namespace.
        """
        if namespace:
            return self._get_nodes_in_namespace(
                namespace=namespace,
                type_=type_,
            )
        return self._get_all_nodes(type_=type_)

    #
    # Get common metrics and dimensions
    #
    def common_dimensions(
        self,
        metrics: List[str],
        name_only: bool = False,
    ) -> List[Union[str, dict]]:  # pragma: no cover # Tested in integration tests
        """
        Return common dimensions for a set of metrics.
        """
        query_params = []
        for metric in metrics:
            query_params.append((models.NodeType.METRIC.value, metric))
        json_response = self._session.get(
            f"/metrics/common/dimensions/?{urlencode(query_params)}",
        ).json()
        if name_only:
            return [dimension["name"] for dimension in json_response]
        return json_response

    def common_metrics(
        self,
        dimensions: List[str],
        name_only: bool = False,
    ) -> List[Union[str, dict]]:  # pragma: no cover # Tested in integration tests
        """
        Return common metrics for a set of dimensions.
        """
        query_params = [("node_type", models.NodeType.METRIC.value)]
        for dim in dimensions:
            query_params.append((models.NodeType.DIMENSION.value, dim))
        json_response = self._session.get(
            f"/dimensions/common/?{urlencode(query_params)}",
        ).json()
        if name_only:
            return [metric["name"] for metric in json_response]
        return [
            {
                "name": metric["name"],
                "display_name": metric["display_name"],
                "description": metric["description"],
                "query": metric["query"],
                # perhaps we should also provide `paths` like we do with common dimensions
            }
            for metric in json_response
        ]

    #
    # Get SQL
    #
    def sql(  # pylint: disable=too-many-arguments
        self,
        metrics: List[str],
        dimensions: Optional[List[str]] = None,
        filters: Optional[List[str]] = None,
        engine_name: Optional[str] = None,
        engine_version: Optional[str] = None,
        measures: bool = False,
        use_materialized: bool = True,
    ):
        """
        Builds SQL for one or more metrics with the provided group by dimensions and filters.
        """
        endpoint = "/sql/"
        if measures:
            endpoint = "/sql/measures/v2"
        response = self._session.get(
            endpoint,
            params={
                "metrics": metrics,
                "dimensions": dimensions or [],
                "filters": filters or [],
                "engine_name": engine_name or self.engine_name,
                "engine_version": engine_version or self.engine_version,
                "use_materialized": use_materialized,
            },
        )
        if response.status_code != 200:
            return response.json()
        if not measures:
            return response.json()["sql"]
        return response.json()

    #
    # Get SQL for a node
    #
    def node_sql(  # pylint: disable=too-many-arguments
        self,
        node_name: str,
        dimensions: Optional[List[str]] = None,
        filters: Optional[List[str]] = None,
        engine_name: Optional[str] = None,
        engine_version: Optional[str] = None,
        use_materialized: bool = True,
    ):
        """
        Builds SQL for a node with the provided dimensions and filters.
        """
        response = self._session.get(
            f"/sql/{node_name}",
            params={
                "dimensions": dimensions or [],
                "filters": filters or [],
                "engine_name": engine_name or self.engine_name,
                "engine_version": engine_version or self.engine_version,
                "use_materialized": use_materialized,
            },
        )
        if response.status_code == 200:
            return response.json()["sql"]
        return response.json()

    #
    # Get data
    #
    def data(  # pylint: disable=too-many-arguments,too-many-locals
        self,
        metrics: List[str],
        dimensions: Optional[List[str]] = None,
        filters: Optional[List[str]] = None,
        engine_name: Optional[str] = None,
        engine_version: Optional[str] = None,
        async_: bool = True,
    ):
        """
        Retrieves the data for one or more metrics with the provided dimensions and filters.
        """
        return self._data(
            metrics=metrics,
            dimensions=dimensions,
            filters=filters,
            engine_name=engine_name,
            engine_version=engine_version,
            async_=async_,
        )

    def node_data(  # pylint: disable=too-many-arguments,too-many-locals
        self,
        node_name: str,
        dimensions: Optional[List[str]] = None,
        filters: Optional[List[str]] = None,
        engine_name: Optional[str] = None,
        engine_version: Optional[str] = None,
        async_: bool = True,
    ):
        """
        Retrieves the data for the node with the provided dimensions and filters.
        """
        return self._data(
            node_name=node_name,
            dimensions=dimensions,
            filters=filters,
            engine_name=engine_name,
            engine_version=engine_version,
            async_=async_,
        )

    def _data(  # pylint: disable=too-many-arguments,too-many-locals
        self,
        node_name: Optional[str] = None,
        metrics: Optional[List[str]] = None,
        dimensions: Optional[List[str]] = None,
        filters: Optional[List[str]] = None,
        engine_name: Optional[str] = None,
        engine_version: Optional[str] = None,
        async_: bool = True,
    ):
        """
        Fetch data for a node or a set of metrics with dimensions and filters.
        """
        printed_links = False
        with alive_bar(
            title="Processing",
            length=20,
            bar="smooth",
            force_tty=True,
            calibrate=5e40,
        ) as progress_bar:
            poll_interval = 1  # Initial polling interval in seconds
            job_state = models.QueryState.UNKNOWN
            results = None
            path = "/data/"
            params = {
                "dimensions": dimensions or [],
                "filters": filters or [],
                "engine_name": engine_name or self.engine_name,
                "engine_version": engine_version or self.engine_version,
                "async_": async_,
            }

            if (node_name and metrics) or not (node_name or metrics):
                raise DJClientException(
                    "Must supply either 'node_name' or 'metrics' to fetch data.",
                )

            if node_name:
                path = f"{path}{node_name}"
            elif metrics:  # pragma: no cover
                params["metrics"] = metrics  # pragma: no cover

            print(f"Fetching data for '{node_name}' or '{metrics}'")  # pragma: no cover

            while job_state not in models.END_JOB_STATES:
                progress_bar()  # pylint: disable=not-callable
                response = self._session.get(
                    path,
                    params=params,
                )
                results = response.json()

                # Raise errors if any
                if not response.status_code < 400:
                    raise DJClientException(
                        f"Error retrieving data: {response.text}",
                    )  # pragma: no cover  # pylint: disable=line-too-long
                if results["state"] not in models.QueryState.list():
                    raise DJClientException(  # pragma: no cover
                        f"Query state {results['state']} is not a DJ-parseable query state!"
                        " Please reach out to your server admin to make sure DJ is configured"
                        " correctly.",
                    )

                # Update the query state and print links if any
                job_state = models.QueryState(results["state"])
                if not printed_links and results["links"]:  # pragma: no cover
                    print(
                        "Links:\n"
                        + "\n".join([f"\t* {link}" for link in results["links"]]),
                    )
                    printed_links = True
                progress_bar.title = f"Status: {job_state.value}"

                # Update the polling interval
                time.sleep(poll_interval)
                poll_interval *= 2

            # Return results if the job has finished
            if job_state == models.QueryState.FINISHED:
                return self.process_results(results)
            if job_state == models.QueryState.CANCELED:  # pragma: no cover
                raise DJClientException("Query execution was canceled!")
            raise DJClientException(  # pragma: no cover
                f"Error retrieving data: {response.text}",
            )

    #
    # Data Catalog and Engines
    #
    def list_catalogs(self) -> List[str]:
        """
        List all catalogs.
        """
        json_response = self._session.get("/catalogs/", timeout=self._timeout).json()
        return [catalog["name"] for catalog in json_response]

    def list_engines(self) -> List[dict]:
        """
        List all engines.
        """
        json_response = self._session.get("/engines/", timeout=self._timeout).json()
        return [
            {"name": engine["name"], "version": engine["version"]}
            for engine in json_response
        ]

    #
    # Nodes
    #
    def source(self, node_name: str) -> Source:
        """
        Retrieves a source node with that name if one exists.
        """
        node_dict = self._verify_node_exists(
            node_name,
            type_=models.NodeType.SOURCE.value,
        )
        node = Source.from_dict(dj_client=self, data=node_dict)
        node.primary_key = self._primary_key_from_columns(node_dict["columns"])
        return node

    def transform(self, node_name: str) -> Transform:
        """
        Retrieves a transform node with that name if one exists.
        """
        node_dict = self._verify_node_exists(
            node_name,
            type_=models.NodeType.TRANSFORM.value,
        )
        node = Transform.from_dict(dj_client=self, data=node_dict)
        node.primary_key = self._primary_key_from_columns(node_dict["columns"])
        return node

    def dimension(self, node_name: str) -> "Dimension":
        """
        Retrieves a Dimension node with that name if one exists.
        """
        node_dict = self._verify_node_exists(
            node_name,
            type_=models.NodeType.DIMENSION.value,
        )
        node = Dimension.from_dict(dj_client=self, data=node_dict)
        node.primary_key = self._primary_key_from_columns(node_dict["columns"])
        return node

    def metric(self, node_name: str) -> "Metric":
        """
        Retrieves a Metric node with that name if one exists.
        """
        node_dict = self._verify_node_exists(
            node_name,
            type_=models.NodeType.METRIC.value,
        )
        metric_dict = self.get_metric(node_name)
        node_dict["required_dimensions"] = metric_dict["required_dimensions"]
        node = Metric.from_dict(dj_client=self, data=node_dict)
        node.primary_key = self._primary_key_from_columns(node_dict["columns"])
        return node

    def cube(self, node_name: str) -> "Cube":  # pragma: no cover
        """
        Retrieves a Cube node with that name if one exists.
        """
        node_dict = self._get_cube(node_name)
        if "name" not in node_dict:
            raise DJClientException(f"Cube `{node_name}` does not exist")
        dimensions = node_dict["cube_node_dimensions"]
        metrics = node_dict["cube_node_metrics"]
        node_dict["metrics"] = metrics
        node_dict["dimensions"] = dimensions
        return Cube.from_dict(dj_client=self, data=node_dict)

    def node(self, node_name: str):
        """
        Retrieves a node with the name if one exists
        """
        node_dict = self._verify_node_exists(node_name)
        if not node_dict or "type" not in node_dict:
            raise DJClientException(
                f"Node `{node_name}` does not exist.",
            )  # pragma: no cover
        if node_dict["type"] == models.NodeType.SOURCE.value:
            return self.source(node_name)
        if node_dict["type"] == models.NodeType.DIMENSION.value:
            return self.dimension(node_name)
        if node_dict["type"] == models.NodeType.TRANSFORM.value:
            return self.transform(node_name)
        if node_dict["type"] == models.NodeType.METRIC.value:
            return self.metric(node_name)
        if node_dict["type"] == models.NodeType.CUBE.value:  # pragma: no cover
            return self.cube(node_name)

        raise DJClientException(  # pragma: no cover
            f"Node `{node_name}` is of unknown type: {node_dict['type']}",
        )

    #
    # Tags
    #
    def list_nodes_with_tags(
        self,
        tag_names: List[str],
        node_type: Optional[models.NodeType] = None,
        skip_missing: bool = False,
    ) -> List[str]:
        """
        Find all nodes with given tags. The nodes must have all the tags.
        """
        node_names: Set[str] = set()
        for tag_name in tag_names:
            try:
                node_names_with_tag = self._list_nodes_with_tag(
                    tag_name,
                    node_type=node_type,
                )
            except DJTagDoesNotExist as exc:
                if skip_missing:
                    continue
                raise exc
            if not node_names:
                node_names = set(node_names_with_tag)
            else:
                node_names = node_names.intersection(node_names_with_tag)
        return list(node_names)

    def tag(self, tag_name: str) -> "Tag":  # pragma: no cover
        """
        Retrieves a Tag with that name if one exists.
        """
        tag_dict = self._get_tag(tag_name)
        if "name" not in tag_dict:
            raise DJClientException(f"Tag `{tag_name}` does not exist")
        return Tag(
            **tag_dict,
            dj_client=self,
        )
