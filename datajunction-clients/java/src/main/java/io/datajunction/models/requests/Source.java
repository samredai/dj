package io.datajunction.models.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Source {
    private String name;
    private String catalog;
    private String schema_;
    private String table;
    @JsonProperty("display_name")
    private String displayName;
    private String description;
    private List<Column> columns;
    @JsonProperty("primary_key")
    private List<String> primaryKey;
    private String mode;
    @JsonProperty("update_if_exists")
    private boolean updateIfExists;

    public Source(String name, String catalog, String schema_, String table, String displayName,
                  String description, List<Column> columns, List<String> primaryKey,
                  String mode, boolean updateIfExists) {
        this.name = name;
        this.catalog = catalog;
        this.schema_ = schema_;
        this.table = table;
        this.displayName = displayName;
        this.description = description;
        this.columns = columns;
        this.primaryKey = primaryKey;
        this.mode = mode;
        this.updateIfExists = updateIfExists;
    }

    public String getName() {
        return name;
    }

    public String getCatalog() {
        return catalog;
    }

    public String getSchema() {
        return schema_;
    }

    public String getTable() {
        return table;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public List<String> getPrimaryKey() {
        return primaryKey;
    }

    public String getMode() {
        return mode;
    }

    public boolean isUpdateIfExists() {
        return updateIfExists;
    }
}