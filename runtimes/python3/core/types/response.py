from typing import Any, Optional
from core.types.global_error import GlobalError

class ResponseContext:
    def __init__(self, data: Any = {}, error: Optional[GlobalError] = None, success: bool = False, contentType: str = "application/json"):
        self.data: Any = data
        self.error: Optional[GlobalError] = error
        self.success: bool = success
        self.contentType: str = contentType

    def to_dict(self):
        return {
            "data": self.data,
            "error": self.error.to_dict() if self.error else None,
            "success": self.success,
            "contentType": self.contentType
        }