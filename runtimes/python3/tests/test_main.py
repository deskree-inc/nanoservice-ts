import unittest
from unittest.mock import MagicMock
from util.metrics.main import Metrics

class TestMetrics(unittest.TestCase):
    def setUp(self):
        self.metrics = Metrics()
        self.metrics.cpu_usage = MagicMock()
        self.metrics.memory_usage = MagicMock()
        self.metrics.time = MagicMock()

    def test_start(self):
        self.metrics.start()
        self.metrics.cpu_usage.start.assert_called_once()
        self.metrics.memory_usage.start.assert_called_once()
        self.metrics.time.start.assert_called_once()

    def test_stop(self):
        self.metrics.stop()
        self.metrics.cpu_usage.stop.assert_called_once()
        self.metrics.memory_usage.stop.assert_called_once()
        self.metrics.time.stop.assert_called_once()

    def test_clear(self):
        self.metrics.clear()
        self.metrics.cpu_usage.clear.assert_called_once()
        self.metrics.memory_usage.clear.assert_called_once()
        self.metrics.time.clear.assert_called_once()

    def test_get_metrics(self):
        self.metrics.cpu_usage.get_metrics.return_value = {"cpu": "data"}
        self.metrics.memory_usage.get_metrics.return_value = {"memory": "data"}
        self.metrics.time.get_metrics.return_value = {"time": "data"}
        metrics = self.metrics.get_metrics()
        self.assertIn("cpu", metrics)
        self.assertIn("memory", metrics)
        self.assertIn("time", metrics)

if __name__ == '__main__':
    unittest.main()
