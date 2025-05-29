[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / NanoService

# Class: NanoService\<T\>

[runner/src](../modules/runner_src.md).NanoService

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `unknown`

  ↳ **`NanoService`**

## Table of contents

### Constructors

- [constructor](runner_src.NanoService.md#constructor)

### Properties

- [inputSchema](runner_src.NanoService.md#inputschema)
- [outputSchema](runner_src.NanoService.md#outputschema)
- [v](runner_src.NanoService.md#v)

### Methods

- [getSchemas](runner_src.NanoService.md#getschemas)
- [handle](runner_src.NanoService.md#handle)
- [run](runner_src.NanoService.md#run)
- [setSchemas](runner_src.NanoService.md#setschemas)
- [validate](runner_src.NanoService.md#validate)

## Constructors

### constructor

• **new NanoService**\<`T`\>(): [`NanoService`](runner_src.NanoService.md)\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[`NanoService`](runner_src.NanoService.md)\<`T`\>

#### Overrides

NodeBase.constructor

#### Defined in

[core/runner/src/NanoService.ts:17](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L17)

## Properties

### inputSchema

• **inputSchema**: `Schema`

#### Defined in

[core/runner/src/NanoService.ts:13](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L13)

___

### outputSchema

• **outputSchema**: `Schema`

#### Defined in

[core/runner/src/NanoService.ts:14](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L14)

___

### v

• `Private` **v**: `Validator`

#### Defined in

[core/runner/src/NanoService.ts:15](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L15)

## Methods

### getSchemas

▸ **getSchemas**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `input` | `Schema` |
| `output` | `Schema` |

#### Defined in

[core/runner/src/NanoService.ts:29](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L29)

___

### handle

▸ **handle**(`ctx`, `inputs`): `Promise`\<[`INanoServiceResponse`](../interfaces/runner_src.INanoServiceResponse.md) \| [`NanoService`](runner_src.NanoService.md)\<`T`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |
| `inputs` | [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md) \| `T` \| [`Condition`](../modules/runner_src.md#condition)[] |

#### Returns

`Promise`\<[`INanoServiceResponse`](../interfaces/runner_src.INanoServiceResponse.md) \| [`NanoService`](runner_src.NanoService.md)\<`T`\>[]\>

#### Defined in

[core/runner/src/NanoService.ts:99](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L99)

___

### run

▸ **run**(`ctx`): `Promise`\<`ResponseContext`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |

#### Returns

`Promise`\<`ResponseContext`\>

#### Defined in

[core/runner/src/NanoService.ts:36](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L36)

___

### setSchemas

▸ **setSchemas**(`input`, `output`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Schema` |
| `output` | `Schema` |

#### Returns

`void`

#### Defined in

[core/runner/src/NanoService.ts:24](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L24)

___

### validate

▸ **validate**(`obj`, `schema`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | [`JsonLikeObject`](../interfaces/runner_src.JsonLikeObject.md) |
| `schema` | `Schema` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/runner/src/NanoService.ts:104](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/NanoService.ts#L104)
