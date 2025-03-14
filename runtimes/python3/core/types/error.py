from typing import List, Union, Optional, Dict

class ErrorContext:
    def __init__(self):
        self.message: Union[List[str], str] = ""
        self.code: int = 0
        self.json: Optional[Dict[str, str]] = None
        self.stack: Optional[str] = None
        self.name: Optional[str] = None