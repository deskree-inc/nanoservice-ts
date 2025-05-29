import unittest
from unittest.mock import patch
from util.metrics.time_calculator import Performance

class TestPerformance(unittest.TestCase):
    def setUp(self):
        self.performance = Performance()

    @patch("time.perf_counter", return_value=100.0)
    @patch("datetime.datetime.now", return_value="2023-01-01T00:00:00")
    def test_start(self, mock_now, mock_perf_counter):
        self.performance.start()
        self.assertEqual(self.performance.start_time, "2023-01-01T00:00:00")
        self.assertEqual(self.performance.performance_start, 100.0)

    @patch("time.perf_counter", return_value=200.0)
    @patch("datetime.datetime.now", return_value="2023-01-01T00:01:00")
    def test_stop(self, mock_now, mock_perf_counter):
        self.performance.stop()
        self.assertEqual(self.performance.end_time, "2023-01-01T00:01:00")
        self.assertEqual(self.performance.performance_end, 200.0)

    def test_get_metrics(self):
        self.performance.performance_start = 100.0
        self.performance.performance_end = 200.0
        metrics = self.performance.get_metrics()
        self.assertAlmostEqual(metrics["duration"], 100000.0)

if __name__ == '__main__':
    unittest.main()
