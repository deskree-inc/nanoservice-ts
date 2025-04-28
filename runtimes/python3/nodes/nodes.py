from nodes.api_call.node import ApiCall
from nodes.sentiment.node import Sentiment
from nodes.generate_pdf.node import GeneratePDF
from nodes.embed.node import EmbeddingClip
from nodes.milvus.insert.node import StoreInMilvus
from nodes.milvus.query.node import SearchInMilvus
from nodes.image_description.node import GenerateCaption

nodes = {
    "api_call": ApiCall(),
    "generate-sentiment": Sentiment(),
    "generate-pdf": GeneratePDF(),
    "embedding-clip": EmbeddingClip(),
    "store-in-milvus": StoreInMilvus(),
    "search-in-milvus": SearchInMilvus(),
    "image-description": GenerateCaption(),
}

def get_nodes():
    return nodes
