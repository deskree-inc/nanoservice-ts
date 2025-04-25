import time
from datetime import datetime
from typing import Optional
from .base import MetricsBase, TimeUsageType

class Performance(MetricsBase):
    def __init__(self):
        super().__init__()
        self.start_time: Optional[str] = None
        self.end_time: Optional[str] = None
        self.performance_start: float = 0.0
        self.performance_end: float = 0.0

    def start(self) -> None:
        """Record the start time using both datetime and high-resolution performance counter"""
        self.start_time = datetime.now().isoformat()
        self.performance_start = time.perf_counter()

    def stop(self) -> None:
        """Record the end time using both datetime and high-resolution performance counter"""
        self.end_time = datetime.now().isoformat()
        self.performance_end = time.perf_counter()
        
    def clear(self) -> None:
        self.start_time = None
        self.end_time = None
        self.performance_start = 0.0
        self.performance_end = 0.0


    def get_metrics(self) -> TimeUsageType:
        """Return time metrics including start, end times and duration in milliseconds"""
        duration_ms = (self.performance_end - self.performance_start) * 1000  # Convert to milliseconds
        
        return {
            'start_time': self.start_time,
            'end_time': self.end_time,
            'duration': duration_ms
        }