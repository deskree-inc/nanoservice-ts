from typing import TypedDict
from .memory import MemoryUsage
from .cpu_metrics import CpuMetrics
from .time_calculator import Performance
from .base import CpuUsageType, MemoryUsageType, TimeUsageType

class MetricsType(TypedDict):
    cpu: CpuUsageType
    memory: MemoryUsageType
    time: TimeUsageType

class Metrics:
    def __init__(self):
        self.cpu_usage = CpuMetrics()
        self.memory_usage = MemoryUsage()
        self.time = Performance()

    def start(self) -> None:
        self.cpu_usage.start()
        self.memory_usage.start()
        self.time.start()

    def retry(self) -> None:
        self.memory_usage.start()

    def stop(self) -> None:
        self.cpu_usage.stop()
        self.time.stop()
        self.memory_usage.stop()

    def clear(self) -> None:
        self.memory_usage.clear()
        self.cpu_usage.clear()
        self.time.clear()

    def get_metrics(self) -> MetricsType:
        cpu = self.cpu_usage.get_metrics()
        memory = self.memory_usage.get_metrics()
        time = self.time.get_metrics()

        return {
            "cpu": cpu,
            "memory": memory,
            "time": time
        }