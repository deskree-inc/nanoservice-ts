[nanoservice-ts - v0.1.0](../README.md) / runner/src

# Module: runner/src

## Table of contents

### Classes

- [Configuration](../classes/runner_src.Configuration.md)
- [ConfigurationResolver](../classes/runner_src.ConfigurationResolver.md)
- [DefaultLogger](../classes/runner_src.DefaultLogger.md)
- [LocalStorage](../classes/runner_src.LocalStorage.md)
- [NanoService](../classes/runner_src.NanoService.md)
- [NanoServiceResponse](../classes/runner_src.NanoServiceResponse.md)
- [NodeMap](../classes/runner_src.NodeMap.md)
- [ResolverBase](../classes/runner_src.ResolverBase.md)
- [Runner](../classes/runner_src.Runner.md)
- [RunnerSteps](../classes/runner_src.RunnerSteps.md)
- [TriggerBase](../classes/runner_src.TriggerBase.md)

### Interfaces

- [INanoServiceResponse](../interfaces/runner_src.INanoServiceResponse.md)
- [JsonLikeObject](../interfaces/runner_src.JsonLikeObject.md)
- [ParamsDictionary](../interfaces/runner_src.ParamsDictionary.md)

### Type Aliases

- [Average](runner_src.md#average)
- [Condition](runner_src.md#condition)
- [Conditions](runner_src.md#conditions)
- [Config](runner_src.md#config)
- [Flow](runner_src.md#flow)
- [GlobalOptions](runner_src.md#globaloptions)
- [Inputs](runner_src.md#inputs)
- [Node](runner_src.md#node)
- [Properties](runner_src.md#properties)
- [Targets](runner_src.md#targets)
- [Trigger](runner_src.md#trigger)
- [TriggerHttp](runner_src.md#triggerhttp)
- [TriggerResponse](runner_src.md#triggerresponse)
- [Triggers](runner_src.md#triggers)

## Type Aliases

### Average

Ƭ **Average**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cpu_percentage` | `number` |
| `cpu_total` | `number` |
| `cpu_usage` | `number` |
| `global_free_memory` | `number` |
| `global_memory` | `number` |
| `max` | `number` |
| `min` | `number` |
| `total` | `number` |

#### Defined in

[core/runner/src/types/Average.ts:1](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Average.ts#L1)

___

### Condition

Ƭ **Condition**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `condition` | `string` |
| `error?` | `string` |
| `steps?` | `NodeBase`[] |
| `type?` | `string` |

#### Defined in

[core/runner/src/types/Condition.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Condition.ts#L3)

___

### Conditions

Ƭ **Conditions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditions` | [`Condition`](runner_src.md#condition)[] |

#### Defined in

[core/runner/src/types/Conditions.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Conditions.ts#L3)

___

### Config

Ƭ **Config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `nodes` | [`Node`](runner_src.md#node) |
| `steps` | `NodeBase`[] \| `RunnerNode`[] |
| `trigger` | [`Trigger`](runner_src.md#trigger) |
| `version` | `string` |

#### Defined in

[core/runner/src/types/Config.ts:6](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Config.ts#L6)

___

### Flow

Ƭ **Flow**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `steps` | `RunnerNode`[] |

#### Defined in

[core/runner/src/types/Flow.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Flow.ts#L3)

___

### GlobalOptions

Ƭ **GlobalOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nodes` | [`NodeMap`](../classes/runner_src.NodeMap.md) |
| `workflows` | `WorkflowLocator` |

#### Defined in

[core/runner/src/types/GlobalOptions.ts:4](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/GlobalOptions.ts#L4)

___

### Inputs

Ƭ **Inputs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inputs` | [`Properties`](runner_src.md#properties) |

#### Defined in

[core/runner/src/types/Inputs.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Inputs.ts#L3)

___

### Node

Ƭ **Node**: `Object`

#### Index signature

▪ [key: `string`]: [`Flow`](runner_src.md#flow) \| [`Properties`](runner_src.md#properties) \| [`Conditions`](runner_src.md#conditions) \| [`Condition`](runner_src.md#condition) \| `Mapper` \| `TryCatch`

#### Defined in

[core/runner/src/types/Node.ts:8](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Node.ts#L8)

___

### Properties

Ƭ **Properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `properties` | [`ParamsDictionary`](../interfaces/runner_src.ParamsDictionary.md) |

#### Defined in

[core/runner/src/types/Properties.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Properties.ts#L3)

___

### Targets

Ƭ **Targets**: `Object`

#### Index signature

▪ [key: `string`]: [`ResolverBase`](../classes/runner_src.ResolverBase.md)

#### Defined in

[core/runner/src/types/Targets.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Targets.ts#L3)

___

### Trigger

Ƭ **Trigger**: `Object`

#### Index signature

▪ [key: `string`]: [`TriggerHttp`](runner_src.md#triggerhttp)

#### Defined in

[core/runner/src/types/Trigger.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Trigger.ts#L3)

___

### TriggerHttp

Ƭ **TriggerHttp**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accept?` | `string` |
| `jwt_secret?` | `string` |
| `method` | `string` |
| `path` | `string` |

#### Defined in

[core/runner/src/types/TriggerHttp.ts:1](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/TriggerHttp.ts#L1)

___

### TriggerResponse

Ƭ **TriggerResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |
| `metrics` | `MetricsType` |

#### Defined in

[core/runner/src/types/TriggerResponse.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/TriggerResponse.ts#L3)

___

### Triggers

Ƭ **Triggers**: `Object`

#### Index signature

▪ [key: `string`]: `Trigger`

#### Defined in

[core/runner/src/types/Triggers.ts:3](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/types/Triggers.ts#L3)
