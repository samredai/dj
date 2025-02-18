package io.datajunction.models.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NodeResponse {
    private String namespace;
    private int nodeRevisionId;
    private int nodeId;
    private String type;
    private String name;
    private String displayName;
    private String version;
    private String status;
    private String mode;
    private Catalog catalog;
    @JsonProperty("schema_")
    private String schema;
    private String table;
    private String description;
    private String query;
    private List<Column> columns;
    private String updatedAt;
    private List<Parent> parents;
    private String createdAt;
    private CreatedBy createdBy;
    private List<String> tags;
    private String currentVersion;
    private boolean missingTable;
    private Object customMetadata;

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public int getNodeRevisionId() {
        return nodeRevisionId;
    }

    public void setNodeRevisionId(int nodeRevisionId) {
        this.nodeRevisionId = nodeRevisionId;
    }

    public int getNodeId() {
        return nodeId;
    }

    public void setNodeId(int nodeId) {
        this.nodeId = nodeId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Catalog getCatalog() {
        return catalog;
    }

    public void setCatalog(Catalog catalog) {
        this.catalog = catalog;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Parent> getParents() {
        return parents;
    }

    public void setParents(List<Parent> parents) {
        this.parents = parents;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public CreatedBy getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(CreatedBy createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getCurrentVersion() {
        return currentVersion;
    }

    public void setCurrentVersion(String currentVersion) {
        this.currentVersion = currentVersion;
    }

    public boolean isMissingTable() {
        return missingTable;
    }

    public void setMissingTable(boolean missingTable) {
        this.missingTable = missingTable;
    }

    public Object getCustomMetadata() {
        return customMetadata;
    }

    public void setCustomMetadata(Object customMetadata) {
        this.customMetadata = customMetadata;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Catalog {
        private String name;
        private List<EngineResponse> engines;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<EngineResponse> getEngines() {
            return engines;
        }

        public void setEngines(List<EngineResponse> engines) {
            this.engines = engines;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Column {
        private String name;
        private String displayName;
        private String type;
        private List<Object> attributes;
        private Object dimension;
        private Object partition;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<Object> getAttributes() {
            return attributes;
        }

        public void setAttributes(List<Object> attributes) {
            this.attributes = attributes;
        }

        public Object getDimension() {
            return dimension;
        }

        public void setDimension(Object dimension) {
            this.dimension = dimension;
        }

        public Object getPartition() {
            return partition;
        }

        public void setPartition(Object partition) {
            this.partition = partition;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Parent {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CreatedBy {
        private String username;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}