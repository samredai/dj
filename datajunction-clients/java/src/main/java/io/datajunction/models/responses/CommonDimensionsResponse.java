package io.datajunction.models.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CommonDimensionsResponse {
    private List<Dimension> dimensions;

    public List<Dimension> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Dimension {
        private String name;
        private String nodeName;
        private String nodeDisplayName;
        private List<String> properties;
        private String type;
        private List<String> path;
        private boolean filterOnly;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getNodeName() {
            return nodeName;
        }

        public void setNodeName(String nodeName) {
            this.nodeName = nodeName;
        }

        public String getNodeDisplayName() {
            return nodeDisplayName;
        }

        public void setNodeDisplayName(String nodeDisplayName) {
            this.nodeDisplayName = nodeDisplayName;
        }

        public List<String> getProperties() {
            return properties;
        }

        public void setProperties(List<String> properties) {
            this.properties = properties;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<String> getPath() {
            return path;
        }

        public void setPath(List<String> path) {
            this.path = path;
        }

        public boolean isFilterOnly() {
            return filterOnly;
        }

        public void setFilterOnly(boolean filterOnly) {
            this.filterOnly = filterOnly;
        }
    }
}