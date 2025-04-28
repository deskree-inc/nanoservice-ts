import unittest
from unittest.mock import patch, MagicMock
from core.types.context import Context

class TestStoreEmbeddings(unittest.IsolatedAsyncioTestCase):

    @patch("nodes.milvus.insert.node.list_collections", return_value=["multimodal_index"])
    @patch("nodes.milvus.insert.node.Collection")
    @patch("nodes.milvus.insert.node.connections.connect")
    async def test_handle_success(self, mock_connect, mock_collection_cls, mock_list_collections):
        mock_collection = MagicMock()
        mock_collection_cls.return_value = mock_collection

        from nodes.milvus.insert.node import StoreInMilvus
        node = StoreInMilvus()

        inputs = {
            "description": "A photo of mountains",
            "image_url": "https://miweb.com/img.jpg",
            "text_vector": [0.1] * 512,
            "image_vector": [0.2] * 512
        }

        ctx = Context()
        response = await node.handle(ctx, inputs)

        self.assertTrue(response.success)
        self.assertEqual(response.data["inserted"], True)
        mock_collection.insert.assert_called_once()

if __name__ == "__main__":
    unittest.main()
