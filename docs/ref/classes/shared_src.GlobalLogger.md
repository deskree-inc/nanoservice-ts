[blok - v0.1.0](../README.md) / [shared/src](../modules/shared_src.md) / GlobalLogger

# Class: GlobalLogger

[shared/src](../modules/shared_src.md).GlobalLogger

## Implements

- [`LoggerContext`](../modules/shared_src.md#loggercontext)

## Table of contents

### Constructors

- [constructor](shared_src.GlobalLogger.md#constructor)

### Properties

- [logs](shared_src.GlobalLogger.md#logs)

### Methods

- [error](shared_src.GlobalLogger.md#error)
- [getLogs](shared_src.GlobalLogger.md#getlogs)
- [getLogsAsBase64](shared_src.GlobalLogger.md#getlogsasbase64)
- [getLogsAsText](shared_src.GlobalLogger.md#getlogsastext)
- [log](shared_src.GlobalLogger.md#log)
- [logLevel](shared_src.GlobalLogger.md#loglevel)

## Constructors

### constructor

• **new GlobalLogger**(): [`GlobalLogger`](shared_src.GlobalLogger.md)

#### Returns

[`GlobalLogger`](shared_src.GlobalLogger.md)

#### Defined in

[core/shared/src/GlobalLogger.ts:6](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L6)

## Properties

### logs

• `Protected` **logs**: `string`[]

#### Defined in

[core/shared/src/GlobalLogger.ts:4](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L4)

## Methods

### error

▸ **error**(`message`, `stack`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `stack` | `string` |

#### Returns

`void`

#### Implementation of

LoggerContext.error

#### Defined in

[core/shared/src/GlobalLogger.ts:12](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L12)

___

### getLogs

▸ **getLogs**(): `string`[]

#### Returns

`string`[]

#### Implementation of

LoggerContext.getLogs

#### Defined in

[core/shared/src/GlobalLogger.ts:14](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L14)

___

### getLogsAsBase64

▸ **getLogsAsBase64**(): `string`

#### Returns

`string`

#### Implementation of

LoggerContext.getLogsAsBase64

#### Defined in

[core/shared/src/GlobalLogger.ts:22](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L22)

___

### getLogsAsText

▸ **getLogsAsText**(): `string`

#### Returns

`string`

#### Implementation of

LoggerContext.getLogsAsText

#### Defined in

[core/shared/src/GlobalLogger.ts:18](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L18)

___

### log

▸ **log**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Implementation of

LoggerContext.log

#### Defined in

[core/shared/src/GlobalLogger.ts:10](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L10)

___

### logLevel

▸ **logLevel**(`level`, `message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `string` |
| `message` | `string` |

#### Returns

`void`

#### Implementation of

LoggerContext.logLevel

#### Defined in

[core/shared/src/GlobalLogger.ts:11](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/GlobalLogger.ts#L11)
