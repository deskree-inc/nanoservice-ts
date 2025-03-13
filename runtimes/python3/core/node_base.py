from abc import ABC, abstractmethod
from typing import Any, Dict, Union
from core.types.context import Context
from core.types.config import ConfigContext
from core.types.response import ResponseContext
from core.util.mapper import Mapper
from core.types.error import ErrorContext
from core.types.global_error import GlobalError

mapper = Mapper()

class NodeBase(ABC):
    def __init__(self):
        self.flow = False
        self.name = ""
        self.node = ""
        self.contentType = ""
        self.active = True
        self.stop = False
        self.originalConfig: Dict[str, Any] = {}
        self.set_var = False

    async def process(self, ctx: Context) -> ResponseContext:
        response: ResponseContext = ResponseContext()
        response.success = True
        response.data = None
        response.error = None

        self.originalConfig = ctx.config.copy()
        ctx.config = self.blueprintMapper(ctx.config, ctx)

        response = await self.run(ctx)
        if response.error is not None:
            raise Exception(response.error)
        
        ctx.response = response

        return response
    
    def blueprintMapper(self, obj: Dict[str, Any], ctx: Context, data: Dict[str, Any] = None) -> Dict[str, Any]:
        new_obj: Dict[str, Any] = obj

        try:
            if isinstance(obj, str):
                new_obj = mapper.replace_string(obj, ctx, data)
            else:
                mapper.replace_object_strings(new_obj, ctx, data)
        except Exception as e:
            print("MAPPER ERROR", e)

        return new_obj

    @abstractmethod
    async def run(self, ctx: Context) -> ResponseContext:
        pass

    def runJs(self, str: str, ctx: Context, data: Dict[str, Any] = {}, func: Dict[str, Any] = {}, vars: Dict[str, Any] = {}) -> Dict[str, Any]:
        return eval(f"lambda ctx, data, func, vars: ({str})")(ctx, data, func, vars)

    def setVar(self, ctx: Context, vars: Dict[str, Any]) -> None:
        if not hasattr(ctx, 'vars') or ctx.vars is None:
            ctx.vars = {}
        ctx.vars.update(vars)

    def getVar(self, ctx: Context, name: str) -> Any:
        return ctx.vars.get(name) if hasattr(ctx, 'vars') else None

    def setError(self, config: Union[str, ErrorContext]) -> GlobalError:
        errorHandler: GlobalError

        if isinstance(config, str):
            errorHandler = GlobalError(config)
        elif isinstance(config, dict) and 'message' in config and len(config) == 1:
            errorHandler = GlobalError(config['message'])
        else:
            err = str(config) if isinstance(config, dict) else "Unknown Error"
            errorHandler = GlobalError(err)
            if isinstance(config, dict):
                errorHandler.setJson(config)

        if isinstance(config, dict):
            if 'json' in config:
                errorHandler.setJson(config['json'])
            if 'stack' in config:
                errorHandler.setStack(config['stack'])
            if 'code' in config:
                errorHandler.setCode(config['code'] if isinstance(config['code'], int) else 500)

        errorHandler.setName(self.name)

        return errorHandler
