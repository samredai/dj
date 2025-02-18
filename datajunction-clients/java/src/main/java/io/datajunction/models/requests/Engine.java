package io.datajunction.models.requests;

public class Engine {
    private String name;
    private String version;

    public Engine(String name, String version) {
        this.name = name;
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public String getVersion() {
        return version;
    }
}