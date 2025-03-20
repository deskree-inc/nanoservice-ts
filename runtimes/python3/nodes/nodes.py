from nodes.api_call.node import ApiCall
from nodes.sentiment.node import Sentiment
from nodes.generate_pdf.node import GeneratePDF

nodes = {
    "api_call": ApiCall(),
    "generate-sentiment": Sentiment(),
    "generate-pdf": GeneratePDF()
}

def get_nodes():
    return nodes
