[blok - v0.1.0](../README.md) / [shared/src](../modules/shared_src.md) / NodeBase

# Class: NodeBase

[shared/src](../modules/shared_src.md).NodeBase

## Table of contents

### Constructors

- [constructor](shared_src.NodeBase.md#constructor)

### Properties

- [active](shared_src.NodeBase.md#active)
- [contentType](shared_src.NodeBase.md#contenttype)
- [flow](shared_src.NodeBase.md#flow)
- [name](shared_src.NodeBase.md#name)
- [originalConfig](shared_src.NodeBase.md#originalconfig)
- [set\_var](shared_src.NodeBase.md#set_var)
- [stop](shared_src.NodeBase.md#stop)

### Methods

- [blueprintMapper](shared_src.NodeBase.md#blueprintmapper)
- [getVar](shared_src.NodeBase.md#getvar)
- [process](shared_src.NodeBase.md#process)
- [processFlow](shared_src.NodeBase.md#processflow)
- [run](shared_src.NodeBase.md#run)
- [runJs](shared_src.NodeBase.md#runjs)
- [runSteps](shared_src.NodeBase.md#runsteps)
- [setError](shared_src.NodeBase.md#seterror)
- [setVar](shared_src.NodeBase.md#setvar)

## Constructors

### constructor

• **new NodeBase**(): [`NodeBase`](shared_src.NodeBase.md)

#### Returns

[`NodeBase`](shared_src.NodeBase.md)

## Properties

### active

• **active**: `boolean` = `true`

#### Defined in

[core/shared/src/NodeBase.ts:17](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L17)

___

### contentType

• **contentType**: `string` = `""`

#### Defined in

[core/shared/src/NodeBase.ts:16](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L16)

___

### flow

• **flow**: `boolean` = `false`

#### Defined in

[core/shared/src/NodeBase.ts:14](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L14)

___

### name

• **name**: `string` = `""`

#### Defined in

[core/shared/src/NodeBase.ts:15](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L15)

___

### originalConfig

• **originalConfig**: `default` = `{}`

#### Defined in

[core/shared/src/NodeBase.ts:19](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L19)

___

### set\_var

• **set\_var**: `boolean` = `false`

#### Defined in

[core/shared/src/NodeBase.ts:20](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L20)

___

### stop

• **stop**: `boolean` = `false`

#### Defined in

[core/shared/src/NodeBase.ts:18](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L18)

## Methods

### blueprintMapper

▸ **blueprintMapper**(`obj`, `ctx`, `data?`): `string` \| `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `default` |
| `ctx` | [`Context`](../modules/shared_src.md#context) |
| `data?` | `default` |

#### Returns

`string` \| `default`

#### Defined in

[core/shared/src/NodeBase.ts:88](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L88)

___

### getVar

▸ **getVar**(`ctx`, `name`): `undefined` \| `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`Context`](../modules/shared_src.md#context) |
| `name` | `string` |

#### Returns

`undefined` \| `default`

#### Defined in

[core/shared/src/NodeBase.ts:84](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L84)

___

### process

▸ **process**(`ctx`, `step?`): `Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`Context`](../modules/shared_src.md#context) |
| `step?` | [`Step`](../modules/shared_src.md#step) |

#### Returns

`Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Defined in

[core/shared/src/NodeBase.ts:22](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L22)

___

### processFlow

▸ **processFlow**(`ctx`): `Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`Context`](../modules/shared_src.md#context) |

#### Returns

`Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Defined in

[core/shared/src/NodeBase.ts:41](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L41)

___

### run

▸ **run**(`ctx`): `Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`Context`](../modules/shared_src.md#context) |

#### Returns

`Promise`\<[`ResponseContext`](../modules/shared_src.md#responsecontext)\>

#### Defined in

[core/shared/src/NodeBase.ts:62](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L62)

___

### runJs

▸ **runJs**(`str`, `ctx`, `data?`, `func?`, `vars?`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `ctx` | [`Context`](../modules/shared_src.md#context) |
| `data` | `default` |
| `func` | [`FunctionContext`](../modules/shared_src.md#functioncontext) |
| `vars` | `VarsContext` |

#### Returns

`default`

#### Defined in

[core/shared/src/NodeBase.ts:69](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L69)

___

### runSteps

▸ **runSteps**(`step`, `ctx`): `Promise`\<[`Context`](../modules/shared_src.md#context)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `step` | [`Step`](../modules/shared_src.md#step) \| [`Step`](../modules/shared_src.md#step)[] |
| `ctx` | [`Context`](../modules/shared_src.md#context) |

#### Returns

`Promise`\<[`Context`](../modules/shared_src.md#context)\>

#### Defined in

[core/shared/src/NodeBase.ts:64](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L64)

___

### setError

▸ **setError**(`config`): [`GlobalError`](shared_src.GlobalError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ErrorContext`](../modules/shared_src.md#errorcontext) |

#### Returns

[`GlobalError`](shared_src.GlobalError.md)

#### Defined in

[core/shared/src/NodeBase.ts:101](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L101)

___

### setVar

▸ **setVar**(`ctx`, `vars`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | [`Context`](../modules/shared_src.md#context) |
| `vars` | `VarsContext` |

#### Returns

`void`

#### Defined in

[core/shared/src/NodeBase.ts:79](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/NodeBase.ts#L79)
