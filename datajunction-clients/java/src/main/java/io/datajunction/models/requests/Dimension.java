package io.datajunction.models.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Dimension {
    private String name;
    @JsonProperty("display_name")
    private String displayName;
    private String description;
    private String mode;
    @JsonProperty("primary_key")
    private List<String> primaryKey;
    private List<String> tags;
    private String query;
    @JsonProperty("update_if_exists")
    private boolean updateIfExists;

    public Dimension(String name, String displayName, String description, String mode,
                     List<String> primaryKey, List<String> tags, String query, boolean updateIfExists) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.mode = mode;
        this.primaryKey = primaryKey;
        this.tags = tags;
        this.query = query;
        this.updateIfExists = updateIfExists;
    }

    public String getName() {
        return name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public String getMode() {
        return mode;
    }

    public List<String> getPrimaryKey() {
        return primaryKey;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getQuery() {
        return query;
    }

    public boolean isUpdateIfExists() {
        return updateIfExists;
    }
}