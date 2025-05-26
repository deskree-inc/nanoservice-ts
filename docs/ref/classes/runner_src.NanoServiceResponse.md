[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / NanoServiceResponse

# Class: NanoServiceResponse

[runner/src](../modules/runner_src.md).NanoServiceResponse

## Implements

- [`INanoServiceResponse`](../interfaces/runner_src.INanoServiceResponse.md)

## Table of contents

### Constructors

- [constructor](runner_src.NanoServiceResponse.md#constructor)

### Properties

- [contentType](runner_src.NanoServiceResponse.md#contenttype)
- [data](runner_src.NanoServiceResponse.md#data)
- [error](runner_src.NanoServiceResponse.md#error)
- [steps](runner_src.NanoServiceResponse.md#steps)
- [success](runner_src.NanoServiceResponse.md#success)

### Methods

- [setError](runner_src.NanoServiceResponse.md#seterror)
- [setSteps](runner_src.NanoServiceResponse.md#setsteps)
- [setSuccess](runner_src.NanoServiceResponse.md#setsuccess)

## Constructors

### constructor

• **new NanoServiceResponse**(): [`NanoServiceResponse`](runner_src.NanoServiceResponse.md)

#### Returns

[`NanoServiceResponse`](runner_src.NanoServiceResponse.md)

#### Defined in

[core/runner/src/NanoServiceResponse.ts:15](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L15)

## Properties

### contentType

• `Optional` **contentType**: `string`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:13](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L13)

___

### data

• **data**: `string` \| [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md) \| [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md)[]

#### Defined in

[core/runner/src/NanoServiceResponse.ts:10](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L10)

___

### error

• **error**: `any`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:11](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L11)

___

### steps

• **steps**: `NodeBase`[]

#### Implementation of

[INanoServiceResponse](../interfaces/runner_src.INanoServiceResponse.md).[steps](../interfaces/runner_src.INanoServiceResponse.md#steps)

#### Defined in

[core/runner/src/NanoServiceResponse.ts:9](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L9)

___

### success

• `Optional` **success**: `boolean`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:12](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L12)

## Methods

### setError

▸ **setError**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `GlobalError` |

#### Returns

`void`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:23](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L23)

___

### setSteps

▸ **setSteps**(`steps`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `steps` | `NodeBase`[] |

#### Returns

`void`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:35](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L35)

___

### setSuccess

▸ **setSuccess**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md) \| [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md)[] |

#### Returns

`void`

#### Defined in

[core/runner/src/NanoServiceResponse.ts:29](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoServiceResponse.ts#L29)
