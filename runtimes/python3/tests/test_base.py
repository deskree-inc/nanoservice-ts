import unittest
from abc import ABCMeta
from util.metrics.base import MetricsBase  # Change relative import to absolute import

class TestMetricsBase(unittest.TestCase):
    def setUp(self):
        self.metrics_base = MetricsBase.__new__(MetricsBase)  # Create instance without calling __init__

    def test_start_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.metrics_base.start()

    def test_stop_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.metrics_base.stop()

    def test_get_metrics_not_implemented(self):
        with self.assertRaises(NotImplementedError):
            self.metrics_base.get_metrics()

if __name__ == '__main__':
    unittest.main()
