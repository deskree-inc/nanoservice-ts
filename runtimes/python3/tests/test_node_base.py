import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from core.types.context import Context
from core.types.response import ResponseContext
from core.types.global_error import GlobalError
from core.node_base import NodeBase
import asyncio

class TestNodeBase(NodeBase):
    async def run(self, ctx: Context) -> ResponseContext:
        response = ResponseContext()
        response.success = True
        response.data = "test_data"
        response.error = None
        return response

class NodeBaseTest(unittest.TestCase):
    def setUp(self):
        self.node = TestNodeBase()
        self.ctx = MagicMock(spec=Context)
        self.ctx.config = {'test_node': {'key': 'value'}}
        self.ctx.response = None
        self.ctx.vars = {}

    def test_process_success(self):
        self.node.name = 'test_node'
        response = asyncio.run(self.node.process(self.ctx))
        self.assertTrue(response.success)
        self.assertEqual(response.data, "test_data")
        self.assertIsNone(response.error)
        self.assertEqual(self.ctx.response, response)

    def test_process_error(self):
        self.node.name = 'test_node'
        response = ResponseContext()
        response.success = False
        response.data = None
        response.error = "Error occurred"
        self.node.run = AsyncMock(return_value=response)
        with self.assertRaises(Exception) as context:
            asyncio.run(self.node.process(self.ctx))
        self.assertEqual(str(context.exception), "Error occurred")

    def test_blueprintMapper_string(self):
        self.node.name = 'test_node'
        with patch('core.util.mapper.Mapper.replace_string', return_value="replaced_value") as mock_replace_string:
            result = self.node.blueprintMapper("test_string", self.ctx)
            self.assertEqual(result, "replaced_value")
            mock_replace_string.assert_called_once_with("test_string", self.ctx, None)

    def test_blueprintMapper_object(self):
        self.node.name = 'test_node'
        obj = {'key': 'value'}
        with patch('core.util.mapper.Mapper.replace_object_strings') as mock_replace_object_strings:
            result = self.node.blueprintMapper(obj, self.ctx)
            self.assertEqual(result, obj)
            mock_replace_object_strings.assert_called_once_with(obj, self.ctx, None)

    def test_run_js(self):
        self.node.name = 'test_node'
        result = self.node.runJs("ctx.config['test_node']['key']", self.ctx)
        self.assertEqual(result, 'value')

    def test_set_var(self):
        self.node.name = 'test_node'
        self.node.setVar(self.ctx, {'new_var': 'new_value'})
        self.assertIn('new_var', self.ctx.vars)
        self.assertEqual(self.ctx.vars['new_var'], 'new_value')

    def test_get_var(self):
        self.node.name = 'test_node'
        self.ctx.vars = {'existing_var': 'existing_value'}
        result = self.node.getVar(self.ctx, 'existing_var')
        self.assertEqual(result, 'existing_value')

    def test_setError_string(self):
        self.node.name = 'test_node'
        error = self.node.setError("Error message")
        self.assertIsInstance(error, GlobalError)
        self.assertEqual(error.message, "Error message")

    def test_setError_dict(self):
        self.node.name = 'test_node'
        error_config = {'message': 'Error message'}
        error = self.node.setError(error_config)
        self.assertIsInstance(error, GlobalError)
        self.assertEqual(error.message, "Error message")

if __name__ == '__main__':
    unittest.main()