from typing import Dict, Any, Optional
from core.types.response import ResponseContext
from core.types.error import ErrorContext
from core.types.config import ConfigContext

class Context:
    def __init__(self):
        self.id: str = ""
        self.workflow_name: str = ""
        self.workflow_path: str = ""
        self.request: Dict[str, Any] = {}
        self.response: ResponseContext = {}
        self.error: ErrorContext = {}
        self.logger: Optional[Any] = None
        self.config: Dict[str, Any] = {}
        self.func: Dict[str, Any] = {}
        self.vars: Dict[str, Any] = {}
        self.env: Dict[str, Any] = {}