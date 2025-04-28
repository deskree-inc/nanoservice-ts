import unittest
from unittest.mock import patch, MagicMock
from util.metrics.cpu_metrics import CpuMetrics

class TestCpuMetrics(unittest.TestCase):
    def setUp(self):
        self.cpu_metrics = CpuMetrics()

    @patch("psutil.cpu_times")
    def test_start(self, mock_cpu_times):
        mock_cpu_times.return_value = MagicMock(idle=100.0, user=50.0, system=50.0)
        self.cpu_metrics.start()
        self.assertEqual(self.cpu_metrics.start_usage["idle"], 100.0)

    @patch("psutil.cpu_times")
    def test_stop(self, mock_cpu_times):
        mock_cpu_times.return_value = MagicMock(idle=200.0, user=100.0, system=100.0)
        self.cpu_metrics.stop()
        self.assertEqual(self.cpu_metrics.end_usage["idle"], 200.0)

    def test_get_average(self):
        self.cpu_metrics.start_usage = {"idle": 100.0, "total": 200.0}
        self.cpu_metrics.end_usage = {"idle": 150.0, "total": 300.0}
        average = self.cpu_metrics.get_average()
        self.assertAlmostEqual(average, 75.0)

    def test_get_metrics(self):
        self.cpu_metrics.start_usage = {"idle": 100.0, "total": 200.0}
        self.cpu_metrics.end_usage = {"idle": 150.0, "total": 300.0}
        metrics = self.cpu_metrics.get_metrics()
        self.assertIn("average", metrics)
        self.assertIn("model", metrics)

if __name__ == '__main__':
    unittest.main()
