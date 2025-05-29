import psutil
from .base import MetricsBase

class MemoryUsage(MetricsBase):
    def __init__(self):
        super().__init__()
        self.min_val = None  # Use None as sentinel
        self.max_val = 0.0
        self.total_val = 0.0
        self.counter = 0

    def start(self) -> None:
        process = psutil.Process()
        val = process.memory_info().rss / (1024 * 1024)  # MB

        self.total_val += val
        self.min_val = val if self.min_val is None else min(self.min_val, val)
        self.max_val = max(self.max_val, val)
        self.counter += 1

    def stop(self) -> None:
        pass

    def get_metrics(self) -> dict:
        average = self.total_val / self.counter if self.counter > 0 else 0
        return {
            'total': average,
            'min': self.min_val if self.min_val is not None else 0.0,
            'max': self.max_val,
            'global_memory': psutil.virtual_memory().total / (1024 * 1024),  # MB
            'global_free_memory': psutil.virtual_memory().available / (1024 * 1024),  # MB
        }

    def clear(self) -> None:
        self.min_val = None
        self.max_val = 0.0
        self.total_val = 0.0
        self.counter = 0
