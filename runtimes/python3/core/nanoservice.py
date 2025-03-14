from abc import abstractmethod
from typing import Any, Dict, List, Union
from jsonschema import Draft7Validator, ValidationError # type: ignore
from copy import deepcopy
import time
import logging
from core.types.context import Context
from core.types.response import ResponseContext
from core.types.nanoservice_response import NanoServiceResponse
from core.node_base import NodeBase

class NanoService(NodeBase):
    def __init__(self):
        NodeBase.__init__(self)
        self.input_schema: Any = {}
        self.output_schema: Any = {}
        self.validator = Draft7Validator(self.input_schema)

    def setSchemas(self, input_schema: Any, output_schema: Any) -> None:
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.validator = Draft7Validator(self.input_schema)

    def getSchemas(self) -> Dict[str, Any]:
        return {
            'input': self.input_schema,
            'output': self.output_schema,
        }

    async def run(self, ctx: Context) -> ResponseContext:
        response: ResponseContext = ResponseContext()
        response.success = True
        response.data = {}
        response.error = None

        start = time.time()
        logging.info(f"Running node: {self.name} [{ctx.config}]")

        config = deepcopy(ctx.config)
        data = ctx.response.get('data') or ctx.request.get('body')

        config = self.blueprintMapper(config, ctx, data)
        self.validate(config, self.input_schema)

        # Process node custom logic
        result = await self.handle(ctx, config)
        self.validator.validate(result, self.output_schema)
        end = time.time()

        logging.info(f"Executed node: {self.name} in {(end - start) * 1000:.2f}ms")

        if result.error is not None:
            response.error = result.error.to_dict()
            response.success = False
        else:
            response.data = result.data

        return response

    def validate(self, obj: Dict[str, Any], schema: Any) -> None:
        try:
            self.validator.validate(obj, schema)
        except ValidationError as e:
            errors: List[str] = []
            for error in sorted(self.validator.evolve(schema=schema).iter_errors(obj), key=str):
                errors.append(f"{error.path} {error.message}")

            raise ValidationError(", ".join(errors)) from e

    @abstractmethod
    async def handle(self, ctx: 'Context', inputs: Dict[str, Any]) -> Union[NanoServiceResponse, List['NanoService[Dict[str, Any]]']]:
        pass
