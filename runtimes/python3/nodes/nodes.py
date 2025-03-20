from nodes.api_call.node import ApiCall
from nodes.sentiment.node import Sentiment

nodes = {
    "api_call": ApiCall(),
    "generate-sentiment": Sentiment(),
}

def get_nodes():
    return nodes
