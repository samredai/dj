package io.datajunction.models.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Catalog {
    private String name;

    public Catalog(@JsonProperty("name") String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}