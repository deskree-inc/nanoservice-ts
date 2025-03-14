import asyncio
from typing import Any, Dict
import unittest
from unittest.mock import MagicMock
from jsonschema import ValidationError # type: ignore
from core.types.context import Context
from core.types.nanoservice_response import NanoServiceResponse
from core.nanoservice import NanoService

class TestNanoService(NanoService):
    async def handle(self, ctx: Context, inputs: Dict[str, Any]) -> NanoServiceResponse:
        response = NanoServiceResponse()
        response.success = True
        response.data = {"result": "test"}
        response.error = None
        return response

class TestNanoServiceMethods(unittest.TestCase):
    def setUp(self):
        self.service = TestNanoService()
        self.ctx = Context()
        self.ctx.config = {}
        self.ctx.response = {'data': None}
        self.ctx.request = {'body': None}
        self.ctx.original_config = {}

    def test_setSchemas(self):
        input_schema = {"type": "object", "properties": {"name": {"type": "string"}}}
        output_schema = {"type": "object", "properties": {"result": {"type": "string"}}}
        self.service.setSchemas(input_schema, output_schema)
        schemas = self.service.getSchemas()
        self.assertEqual(schemas['input'], input_schema)
        self.assertEqual(schemas['output'], output_schema)

    def test_run_success(self):
        self.service.name = "test_service"
        self.service.blueprintMapper = MagicMock(return_value={})
        self.service.setVar = MagicMock()
        self.service.content_type = "application/json"
        self.service.setSchemas({}, {})

        response = asyncio.run(self.service.run(self.ctx))
        self.assertTrue(response['success'])
        self.assertIn('data', response)
        self.assertIsNone(response['error'])

    def test_run_validation_error(self):
        self.service.name = "test_service"
        self.service.blueprintMapper = MagicMock(return_value={})
        self.service.setSchemas({"type": "object", "properties": {"name": {"type": "string"}}}, {"type": "object"})

        self.ctx.request['body'] = {"name": 123}  # Invalid input

        with self.assertRaises(ValidationError):
            asyncio.run(self.service.run(self.ctx))

    def test_validate_success(self):
        schema = {"type": "object", "properties": {"name": {"type": "string"}}}
        obj = {"name": "test"}
        self.service.validate(obj, schema)

    def test_validate_error(self):
        schema = {"type": "object", "properties": {"name": {"type": "string"}}}
        obj = {"name": 123}  # Invalid input

        with self.assertRaises(ValidationError):
            self.service.validate(obj, schema)

if __name__ == '__main__':
    unittest.main()