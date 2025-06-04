[blok - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / DefaultLogger

# Class: DefaultLogger

[runner/src](../modules/runner_src.md).DefaultLogger

DefaultLogger class extends GlobalLogger to provide logging functionality
with additional metadata such as workflow name, workflow path, request ID,
environment, and application name.

## Hierarchy

- `unknown`

  ↳ **`DefaultLogger`**

## Table of contents

### Constructors

- [constructor](runner_src.DefaultLogger.md#constructor)

### Properties

- [appName](runner_src.DefaultLogger.md#appname)
- [env](runner_src.DefaultLogger.md#env)
- [requestId](runner_src.DefaultLogger.md#requestid)
- [workflowName](runner_src.DefaultLogger.md#workflowname)
- [workflowPath](runner_src.DefaultLogger.md#workflowpath)

### Methods

- [error](runner_src.DefaultLogger.md#error)
- [injectMetadata](runner_src.DefaultLogger.md#injectmetadata)
- [log](runner_src.DefaultLogger.md#log)
- [logLevel](runner_src.DefaultLogger.md#loglevel)

## Constructors

### constructor

• **new DefaultLogger**(`workflowName?`, `workflowPath?`, `requestId?`): [`DefaultLogger`](runner_src.DefaultLogger.md)

Constructs a new DefaultLogger instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workflowName?` | `string` | The name of the workflow. |
| `workflowPath?` | `string` | The path of the workflow. |
| `requestId?` | `string` | The ID of the request. |

#### Returns

[`DefaultLogger`](runner_src.DefaultLogger.md)

#### Overrides

GlobalLogger.constructor

#### Defined in

[core/runner/src/DefaultLogger.ts:41](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L41)

## Properties

### appName

• **appName**: `undefined` \| `string` = `""`

The name of the application.

#### Defined in

[core/runner/src/DefaultLogger.ts:32](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L32)

___

### env

• **env**: `undefined` \| `string` = `""`

The environment in which the application is running.

#### Defined in

[core/runner/src/DefaultLogger.ts:27](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L27)

___

### requestId

• **requestId**: `undefined` \| `string` = `""`

The ID of the request.

#### Defined in

[core/runner/src/DefaultLogger.ts:22](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L22)

___

### workflowName

• **workflowName**: `undefined` \| `string` = `""`

The name of the workflow.

#### Defined in

[core/runner/src/DefaultLogger.ts:12](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L12)

___

### workflowPath

• **workflowPath**: `undefined` \| `string` = `""`

The path of the workflow.

#### Defined in

[core/runner/src/DefaultLogger.ts:17](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L17)

## Methods

### error

▸ **error**(`message`, `stack?`): `void`

Logs an error message to the console with metadata.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | The error message to log. |
| `stack` | `string` | `""` | The stack trace (optional). |

#### Returns

`void`

#### Defined in

[core/runner/src/DefaultLogger.ts:77](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L77)

___

### injectMetadata

▸ **injectMetadata**(`message`, `level?`, `stack?`): `string`

Injects metadata into a log message.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | The message to inject metadata into. |
| `level` | `string` | `"info"` | The log level (default is "info"). |
| `stack` | `string` | `""` | The stack trace (optional). |

#### Returns

`string`

The message with injected metadata.

#### Defined in

[core/runner/src/DefaultLogger.ts:90](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L90)

___

### log

▸ **log**(`message`): `void`

Logs a message to the console with metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message to log. |

#### Returns

`void`

#### Defined in

[core/runner/src/DefaultLogger.ts:55](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L55)

___

### logLevel

▸ **logLevel**(`level`, `message`): `void`

Logs a message to the console with a specified log level and metadata.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `level` | `string` | The log level (e.g., "info", "error"). |
| `message` | `string` | The message to log. |

#### Returns

`void`

#### Defined in

[core/runner/src/DefaultLogger.ts:66](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/DefaultLogger.ts#L66)
