[blok - v0.1.0](../README.md) / shared/src

# Module: shared/src

## Table of contents

### Classes

- [GlobalError](../classes/shared_src.GlobalError.md)
- [GlobalLogger](../classes/shared_src.GlobalLogger.md)
- [MemoryUsage](../classes/shared_src.MemoryUsage.md)
- [Metrics](../classes/shared_src.Metrics.md)
- [NodeBase](../classes/shared_src.NodeBase.md)
- [Trigger](../classes/shared_src.Trigger.md)

### Type Aliases

- [ConfigContext](shared_src.md#configcontext)
- [Context](shared_src.md#context)
- [ErrorContext](shared_src.md#errorcontext)
- [FunctionContext](shared_src.md#functioncontext)
- [LoggerContext](shared_src.md#loggercontext)
- [MetricsType](shared_src.md#metricstype)
- [NodeConfigContext](shared_src.md#nodeconfigcontext)
- [RequestContext](shared_src.md#requestcontext)
- [ResponseContext](shared_src.md#responsecontext)
- [Step](shared_src.md#step)

## Type Aliases

### ConfigContext

Ƭ **ConfigContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodes?` | [`NodeConfigContext`](shared_src.md#nodeconfigcontext) |

#### Defined in

[core/shared/src/types/ConfigContext.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/ConfigContext.ts#L3)

___

### Context

Ƭ **Context**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_PRIVATE_` | `unknown` |
| `config` | [`ConfigContext`](shared_src.md#configcontext) |
| `env?` | `EnvContext` |
| `error` | [`ErrorContext`](shared_src.md#errorcontext) |
| `eventLogger` | [`GlobalLogger`](../classes/shared_src.GlobalLogger.md) \| `unknown` |
| `func?` | [`FunctionContext`](shared_src.md#functioncontext) |
| `id` | `string` |
| `logger` | [`LoggerContext`](shared_src.md#loggercontext) |
| `request` | [`RequestContext`](shared_src.md#requestcontext) |
| `response` | [`ResponseContext`](shared_src.md#responsecontext) |
| `vars?` | `VarsContext` |
| `workflow_name?` | `string` |
| `workflow_path?` | `string` |

#### Defined in

[core/shared/src/types/Context.ts:11](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/Context.ts#L11)

___

### ErrorContext

Ƭ **ErrorContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code?` | `number` |
| `json?` | `ParamsDictionary` |
| `message` | `string`[] \| `string` |
| `name?` | `string` |
| `stack?` | `string` |

#### Defined in

[core/shared/src/types/ErrorContext.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/ErrorContext.ts#L3)

___

### FunctionContext

Ƭ **FunctionContext**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[core/shared/src/types/FunctionContext.ts:1](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/FunctionContext.ts#L1)

___

### LoggerContext

Ƭ **LoggerContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | (`message`: `string`, `stack`: `string`) => `void` |
| `getLogs` | () => `string`[] |
| `getLogsAsBase64` | () => `string` |
| `getLogsAsText` | () => `string` |
| `log` | (`message`: `string`) => `void` |
| `logLevel` | (`level`: `string`, `message`: `string`) => `void` |

#### Defined in

[core/shared/src/types/LoggerContext.ts:1](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/LoggerContext.ts#L1)

___

### MetricsType

Ƭ **MetricsType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cpu` | `CpuUsageType` |
| `memory` | `MemoryUsageType` |
| `time` | `TimeUsageType` |

#### Defined in

[core/shared/src/Metrics.ts:49](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/Metrics.ts#L49)

___

### NodeConfigContext

Ƭ **NodeConfigContext**: `Object`

#### Index signature

▪ [key: `string`]: `ParamsDictionary`

#### Defined in

[core/shared/src/types/NodeConfigContext.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/NodeConfigContext.ts#L3)

___

### RequestContext

Ƭ **RequestContext**: `Object`

#### Index signature

▪ [key: `string`]: `ParamsDictionary`

#### Defined in

[core/shared/src/types/RequestContext.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/RequestContext.ts#L3)

___

### ResponseContext

Ƭ **ResponseContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentType?` | `string` |
| `data` | `unknown` |
| `error` | [`GlobalError`](../classes/shared_src.GlobalError.md) \| ``null`` |
| `success?` | `boolean` |

#### Defined in

[core/shared/src/types/ResponseContext.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/ResponseContext.ts#L3)

___

### Step

Ƭ **Step**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `active?` | `boolean` |
| `name` | `string` |
| `node` | `string` |
| `stop?` | `boolean` |
| `type` | `string` |
| `run` | (`ctx`: [`Context`](shared_src.md#context)) => `Promise`\<`unknown`\> |

#### Defined in

[core/shared/src/types/Step.ts:3](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/types/Step.ts#L3)
