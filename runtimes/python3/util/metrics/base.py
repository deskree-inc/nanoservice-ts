from abc import ABC, abstractmethod
from typing import Dict, Union, TypedDict

class MemoryUsageType(TypedDict):
    total: float
    min: float
    max: float
    global_memory: float
    global_free_memory: float

class TimeUsageType(TypedDict):
    start_time: str
    end_time: str
    duration: float

class CpuUsageType(TypedDict):
    average: float
    total: int
    model: str
    usage: float

MetricsResultType = Union[MemoryUsageType, TimeUsageType, CpuUsageType]

class MetricsBase(ABC):
    @abstractmethod
    def start(self, ms: float = None) -> None:
        """Start the metrics collection"""
        pass

    @abstractmethod
    def stop(self) -> None:
        """Stop the metrics collection"""
        pass

    @abstractmethod
    def get_metrics(self) -> MetricsResultType:
        """Get the collected metrics"""
        pass