import re
from typing import Any, Dict

ParamsDictionary = Dict[str, Any]
Context = Dict[str, Any]
FunctionContext = Dict[str, Any]
VarsContext = Dict[str, Any]

class Mapper:
    def replace_object_strings(self, obj: ParamsDictionary, ctx: Context, data: ParamsDictionary) -> None:
        for key, value in obj.items():
            if isinstance(value, str):
                obj[key] = self.replace_string(value, ctx, data)
            elif isinstance(value, dict):
                self.replace_object_strings(value, ctx, data)

    def replace_string(self, str_data: str, ctx: Context, data: ParamsDictionary) -> str:
        str_ = str_data
        regex = re.compile(r'\${(.*?)}')
        matches = regex.findall(str_)

        if matches:
            for match in matches:
                try:
                    key = match
                    value = data.get(key) or self.run_js(key, ctx, data)
                    str_ = str_.replace(f"${{{match}}}", str(value))
                except Exception as e:
                    print("Mapper Error 1", e)

        result = self.js_mapper(str_, ctx, data)
        return str(result)

    def run_js(self, str_: str, ctx: Context, data: ParamsDictionary = {}, func: FunctionContext = {}, vars: VarsContext = {}) -> ParamsDictionary:
        return eval(f"lambda ctx, data, func, vars: {str_}")(ctx, data, func, vars)

    def js_mapper(self, str_: str, ctx: Context, data: ParamsDictionary) -> ParamsDictionary | str:
        try:
            if isinstance(str_, str) and str_.startswith("js/"):
                fn = str_.replace("js/", "")
                return self.run_js(fn, ctx, data, ctx.get('func', {}), ctx.get('vars', {}))
        except Exception as error:
            print("Mapper Error 2", error)
        return str_
