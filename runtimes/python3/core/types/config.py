from typing import Any, Dict, Optional

class ConfigContext:
    def __init__(self):
        self.nodes: Optional[Dict[str, Dict[str, Any]]] = None
