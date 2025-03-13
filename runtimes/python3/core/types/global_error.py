from typing import Optional, Dict, Any

class GlobalError(Exception):
    def __init__(self, msg: Optional[str] = None):
        Exception.__init__(self)
        self.context: Dict[str, Any] = {'message': msg}
        self.message: str = msg
        self.code = 500

    def setCode(self, code: Optional[int] = None) -> None:
        self.code = code
        self.context['code'] = code

    def setJson(self, json: Optional[Dict[str, Any]] = None) -> None:
        self.context['json'] = json

    def setStack(self, stack: Optional[str] = None) -> None:
        self.context['stack'] = stack

    def setName(self, name: Optional[str] = None) -> None:
        self.context['name'] = name

    def hasJson(self) -> bool:
        return 'json' in self.context

    def __str__(self) -> str:
        if 'json' in self.context:
            return str(self.context['json'])
        return self.context['message'] or ''
    
    def to_dict(self):
        return self.context
