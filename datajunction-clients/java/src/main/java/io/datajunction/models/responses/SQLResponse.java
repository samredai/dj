package io.datajunction.models.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SQLResponse {
    private String sql;
    private List<Column> columns;
    private String dialect;
    private List<String> upstreamTables;

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public String getDialect() {
        return dialect;
    }

    public void setDialect(String dialect) {
        this.dialect = dialect;
    }

    public List<String> getUpstreamTables() {
        return upstreamTables;
    }

    public void setUpstreamTables(List<String> upstreamTables) {
        this.upstreamTables = upstreamTables;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Column {
        private String name;
        private String type;
        private String column;
        private String node;
        private String semanticEntity;
        private String semanticType;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getColumn() {
            return column;
        }

        public void setColumn(String column) {
            this.column = column;
        }

        public String getNode() {
            return node;
        }

        public void setNode(String node) {
            this.node = node;
        }

        public String getSemanticEntity() {
            return semanticEntity;
        }

        public void setSemanticEntity(String semanticEntity) {
            this.semanticEntity = semanticEntity;
        }

        public String getSemanticType() {
            return semanticType;
        }

        public void setSemanticType(String semanticType) {
            this.semanticType = semanticType;
        }
    }
}