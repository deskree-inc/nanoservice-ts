import unittest
from unittest.mock import MagicMock
from PIL import Image  # type: ignore
from io import BytesIO
import base64

from nodes.embed.node import EmbeddingClip
from core.types.context import Context

class TestEmbeddingClip(unittest.IsolatedAsyncioTestCase):

    def setUp(self):
        self.node = EmbeddingClip()

        self.node.embed_text = MagicMock(return_value=[0.1, 0.2, 0.3])
        self.node.embed_image = MagicMock(return_value=[0.4, 0.5, 0.6])

    def create_base64_image(self):
        image = Image.new("RGB", (50, 50), color="blue")
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode()

    async def test_handle_success(self):
        ctx = Context()
        inputs = {
            "description": "Un paisaje azul",
            "image_base64": self.create_base64_image()
        }

        response = await self.node.handle(ctx, inputs)

        self.assertTrue(response.success)
        self.assertIn("text_vector", response.data)
        self.assertIn("image_vector", response.data)
        self.assertEqual(response.data["text_vector"], [0.1, 0.2, 0.3])
        self.assertEqual(response.data["image_vector"], [0.4, 0.5, 0.6])

if __name__ == "__main__":
    unittest.main()
