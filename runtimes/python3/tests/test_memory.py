import unittest
from unittest.mock import patch, MagicMock
from ..util.metrics.memory import MemoryUsage

class TestMemoryUsage(unittest.TestCase):
    def setUp(self):
        self.memory_usage = MemoryUsage()

    @patch("psutil.Process")
    def test_start(self, mock_process):
        mock_process.return_value.memory_info.return_value.rss = 1048576  # 1 MB
        self.memory_usage.start()
        self.assertEqual(self.memory_usage.min_val, 1.0)

    @patch("psutil.virtual_memory")
    def test_get_metrics(self, mock_virtual_memory):
        mock_virtual_memory.return_value.total = 8 * 1024 * 1024 * 1024  # 8 GB
        mock_virtual_memory.return_value.available = 4 * 1024 * 1024 * 1024  # 4 GB
        self.memory_usage.total_val = 10.0
        self.memory_usage.counter = 2
        metrics = self.memory_usage.get_metrics()
        self.assertAlmostEqual(metrics["total"], 5.0)
        self.assertIn("global_memory", metrics)

if __name__ == '__main__':
    unittest.main()
