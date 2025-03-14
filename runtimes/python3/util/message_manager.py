import json
import base64
from xml.etree import ElementTree as ET

def decode_message(payload):
    # Extract fields from the payload
    message = payload.Message
    encoding = payload.Encoding
    message_type = payload.Type

    # Step 1: Decode the message based on the encoding type
    if encoding == "BASE64":
        decoded_message = base64.b64decode(message).decode("utf-8")
    elif encoding == "STRING":
        decoded_message = message
    else:
        raise ValueError(f"Unsupported encoding type: {encoding}")

    # Step 2: Parse the decoded message based on the type
    if message_type == "JSON":
        return json.loads(decoded_message)
    elif message_type == "XML":
        return ET.fromstring(decoded_message)
    elif message_type == "TEXT":
        return decoded_message
    elif message_type == "HTML":
        return decoded_message
    elif message_type == "BINARY":
        return base64.b64decode(message)  # Return binary data
    else:
        raise ValueError(f"Unsupported message type: {message_type}")
    
# Encode the JSON or STR message in BASE64 format
def encode_message(message, message_type):
    # Step 1: Encode the message based on the type
    if message_type == "JSON":
        if hasattr(message, 'to_dict'):
            encoded_message = json.dumps(message.to_dict())
        else:
            encoded_message = json.dumps(message)
    elif message_type == "XML":
        encoded_message = ET.tostring(message).decode("utf-8")
    elif message_type == "TEXT":
        encoded_message = message
    elif message_type == "HTML":
        encoded_message = message
    elif message_type == "BINARY":
        encoded_message = base64.b64encode(message).decode("utf-8")
    else:
        raise ValueError(f"Unsupported message type: {message_type}")

    # Step 2: Encode the message in BASE64 format
    return base64.b64encode(encoded_message.encode("utf-8")).decode("utf-8")