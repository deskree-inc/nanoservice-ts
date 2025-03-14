import unittest
from core.util.mapper import Mapper

class TestMapper(unittest.TestCase):
    def setUp(self):
        self.mapper = Mapper()

    def test_replace_object_strings(self):
        obj = {
            "key1": "value1",
            "key2": "${replace_me}",
            "nested": {
                "key3": "nested_${replace_me}"
            }
        }
        ctx = {}
        data = {"replace_me": "replaced_value"}
        self.mapper.replace_object_strings(obj, ctx, data)
        self.assertEqual(obj["key2"], "replaced_value")
        self.assertEqual(obj["nested"]["key3"], "nested_replaced_value")

    def test_replace_string(self):
        str_data = "This is a ${replace_me} string"
        ctx = {}
        data = {"replace_me": "replaced_value"}
        result = self.mapper.replace_string(str_data, ctx, data)
        self.assertEqual(result, "This is a replaced_value string")

    def test_run_js(self):
        str_ = "data['key'] + 1"
        ctx = {}
        data = {"key": 1}
        result = self.mapper.run_js(str_, ctx, data)
        self.assertEqual(result, 2)

    def test_js_mapper(self):
        str_ = "js/data['key'] + 1"
        ctx = {}
        data = {"key": 1}
        result = self.mapper.js_mapper(str_, ctx, data)
        self.assertEqual(result, 2)

    def test_js_mapper_no_js_prefix(self):
        str_ = "no_js_prefix"
        ctx = {}
        data = {}
        result = self.mapper.js_mapper(str_, ctx, data)
        self.assertEqual(result, "no_js_prefix")

if __name__ == '__main__':
    unittest.main()