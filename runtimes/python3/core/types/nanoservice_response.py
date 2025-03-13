from typing import List, Optional, Any
from core.types.global_error import GlobalError
from core.node_base import NodeBase 
from core.types.response import ResponseContext

class NanoServiceResponse(ResponseContext):
    def __init__(self):
        self.steps: List[NodeBase] = []
        self.data: Any = {}
        self.error: Optional[GlobalError] = None
        self.success: Optional[bool] = True
        self.contentType: Optional[str] = "application/json"

    def setError(self, error: GlobalError) -> None:
        self.error = error
        self.success = False
        self.data = {}

    def setSuccess(self, data: Any) -> None:
        self.data = data
        self.error = None
        self.success = True
