package io.datajunction.models.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CatalogResponse {
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