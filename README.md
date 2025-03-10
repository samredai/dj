# DataJunction

![test workflow](https://github.com/DataJunction/dj/actions/workflows/test.yml/badge.svg?branch=main)
![client-integration-tests workflow](https://github.com/DataJunction/dj/actions/workflows/client-integration-tests.yml/badge.svg?branch=main)

## Introduction

DataJunction (DJ) is an open source **metrics platform** that allows users to define
metrics and the data models behind them using **SQL**, serving as a **semantic layer**
on top of a physical data warehouse. By leveraging this metadata, DJ can enable efficient
retrieval of metrics data across different dimensions and filters.

[Documentation](http://datajunction.io)

![DataJunction](docs/images/dj-landing.png)

## Getting Started

To launch the DataJunction UI with a minimal DataJunction backend, start the default docker compose environment.

```sh
docker compose up
```

If you'd like to launch the full suite of services, including open-source implementations of the DataJunction query service and
DataJunction reflection service specifications, use the `demo` profile.

```sh
docker compose --profile demo up
```

DJUI: [http://localhost:3000/](http://localhost:3000/)  
DJ Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)  
DJQS Swagger Docs: [http://localhost:8001/docs](http://localhost:8001/docs)  
Jaeger UI: [http://localhost:16686/search](http://localhost:16686/search)  
Jupyter Lab: [http://localhost:8181](http://localhost:8181)  

## How does this work?

At its core, DJ stores metrics and their upstream abstractions as interconnected nodes.
These nodes can represent a variety of elements, such as tables in a data warehouse
(**source nodes**), SQL transformation logic (**transform nodes**), dimensions logic,
metrics logic, and even selections of metrics, dimensions, and filters (**cube nodes**).

By parsing each node's SQL into an AST and through dimensional links between columns,
DJ can infer a graph of dependencies between nodes, which allows it to find the
appropriate join paths between nodes to generate queries for metrics.

## The Community

To get involved, feel free to join the DataJunction open-source community sync that's held ever two weeks--all are welcome! For an invite to the sync, simply join the [datajunction-community](https://groups.google.com/g/datajunction-community) google group. Also please join us on [slack](https://join.slack.com/t/dj-w5m3063/shared_invite/zt-2zazrd9xw-wnjm5a_sIuQ3uqgjS~pO~w)!
