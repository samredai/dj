"""
A DataJunction client for connecting to a DataJunction server
"""
from importlib.metadata import PackageNotFoundError, version  # pragma: no cover

from datajunction.client import DJBuilder, DJClient
from datajunction.models import (
    AvailabilityState,
    ColumnAttribute,
    Engine,
    MaterializationConfig,
    NodeMode,
)
from datajunction.nodes import (
    Cube,
    Dimension,
    Metric,
    Namespace,
    Node,
    Source,
    Transform,
)

try:
    # Change here if project is renamed and does not equal the package name
    DIST_NAME = __name__
    __version__ = version(DIST_NAME)
except PackageNotFoundError:  # pragma: no cover
    __version__ = "unknown"
finally:
    del version, PackageNotFoundError


__all__ = [
    "DJClient",
    "DJBuilder",
    "AvailabilityState",
    "ColumnAttribute",
    "Source",
    "Dimension",
    "Transform",
    "MaterializationConfig",
    "Metric",
    "Cube",
    "Node",
    "NodeMode",
    "Namespace",
    "Engine",
]