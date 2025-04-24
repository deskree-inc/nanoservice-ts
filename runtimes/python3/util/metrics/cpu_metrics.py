import psutil
from typing import TypedDict
from .base import MetricsBase, CpuUsageType

class MeasureCpuType(TypedDict):
    idle: float
    total: float

class CpuMetrics(MetricsBase):
    def __init__(self):
        super().__init__()
        self.num_cpus = psutil.cpu_count(logical=True)
        self.start_usage: MeasureCpuType = {"idle": 0.0, "total": 0.0}
        self.end_usage: MeasureCpuType = {"idle": 0.0, "total": 0.0}
        self.cpu_model = self._get_cpu_model()

    def _get_cpu_model(self) -> str:
        # Placeholder: psutil doesn't expose CPU model directly
        # You could use platform module or read from /proc/cpuinfo on Linux
        try:
            with open("/proc/cpuinfo") as f:
                for line in f:
                    if "model name" in line:
                        return line.strip().split(": ")[1]
        except Exception:
            pass
        return "Unknown"

    def start(self) -> None:
        self.start_usage = self._read_cpu_times()

    def stop(self) -> None:
        self.end_usage = self._read_cpu_times()
    
    def clear(self) -> None:
        self.start_usage = {"idle": 0.0, "total": 0.0}
        self.end_usage = {"idle": 0.0, "total": 0.0}

    def _read_cpu_times(self) -> MeasureCpuType:
        cpu_times = psutil.cpu_times(percpu=False)  # total across all CPUs
        idle = cpu_times.idle
        total = sum(cpu_times)
        return {"idle": idle, "total": total}

    def get_average(self) -> float:
        idle_diff = self.end_usage["idle"] - self.start_usage["idle"]
        total_diff = self.end_usage["total"] - self.start_usage["total"]
        if total_diff == 0:
            return 0.0
        return 100.0 * (1.0 - (idle_diff / total_diff))

    def get_metrics(self) -> CpuUsageType:
        average = self.get_average()
        usage = (average * self.num_cpus) / 100.0
        return {
            "total": self.num_cpus,
            "average": average,
            "usage": usage,
            "model": self.cpu_model,
        }
