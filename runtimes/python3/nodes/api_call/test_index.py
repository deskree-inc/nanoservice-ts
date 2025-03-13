import asyncio
import unittest
from unittest.mock import patch, AsyncMock
from core.types.context import Context
from core.types.global_error import GlobalError
from aiohttp import ClientResponse # type: ignore
from nodes.api_call.node import ApiCall, InputType

class TestApiCall(unittest.TestCase):
    def test_handle_success_json_response(self):
        # Arrange
        api_call = ApiCall()
        api_call.name = "TestApiCall"
        ctx = Context()
        inputs = InputType()
        inputs.method = "GET"
        inputs.url = "https://restcountries.com/v3.1/all"
        inputs.headers = {"Content-Type": "application/json"}
        inputs.responseType = "application/json"
        inputs.body = None

        # Act
        response = asyncio.run(api_call.handle(ctx, inputs))

        # Assert
        self.assertEqual(response.error, None)

    def test_handle_success_text_response(self):
        # Arrange
        api_call = ApiCall()
        ctx = Context()
        inputs = InputType()
        inputs.method = "GET"
        inputs.url = "https://api.ipify.org?format=text"
        inputs.headers = {"Content-Type": "text/plain"}
        inputs.responseType = "text/plain"
        inputs.body = {}

        # Act
        response = asyncio.run(api_call.handle(ctx, inputs))

        # Assert
        self.assertEqual(response.error, None)

    @patch('aiohttp.ClientSession')
    def test_handle_exception(self, MockClientSession):
        # Arrange
        api_call = ApiCall()
        ctx = Context()
        inputs = InputType()
        inputs.method = "GET"
        inputs.url = "http://example.com"
        inputs.headers = {"Content-Type": "application/json"}
        inputs.responseType = "application/json"
        inputs.body = {}

        MockClientSession.return_value.__aenter__.return_value.request.side_effect = Exception("Test Exception")

        # Act
        response = asyncio.run(api_call.handle(ctx, inputs))

        # Assert
        self.assertFalse(response.success)
        self.assertIsInstance(response.error, GlobalError)
        self.assertEqual(response.error.code, 500)

if __name__ == '__main__':
    unittest.main()