[nanoservice-ts - v0.1.0](../README.md) / [shared/src](../modules/shared_src.md) / GlobalError

# Class: GlobalError

[shared/src](../modules/shared_src.md).GlobalError

## Hierarchy

- `Error`

  ↳ **`GlobalError`**

## Table of contents

### Constructors

- [constructor](shared_src.GlobalError.md#constructor)

### Properties

- [context](shared_src.GlobalError.md#context)
- [message](shared_src.GlobalError.md#message)
- [name](shared_src.GlobalError.md#name)
- [stack](shared_src.GlobalError.md#stack)
- [prepareStackTrace](shared_src.GlobalError.md#preparestacktrace)
- [stackTraceLimit](shared_src.GlobalError.md#stacktracelimit)

### Methods

- [hasJson](shared_src.GlobalError.md#hasjson)
- [setCode](shared_src.GlobalError.md#setcode)
- [setJson](shared_src.GlobalError.md#setjson)
- [setName](shared_src.GlobalError.md#setname)
- [setStack](shared_src.GlobalError.md#setstack)
- [toString](shared_src.GlobalError.md#tostring)
- [captureStackTrace](shared_src.GlobalError.md#capturestacktrace)

## Constructors

### constructor

• **new GlobalError**(`msg`): [`GlobalError`](shared_src.GlobalError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `undefined` \| `string` |

#### Returns

[`GlobalError`](shared_src.GlobalError.md)

#### Overrides

Error.constructor

#### Defined in

[core/shared/src/GlobalError.ts:7](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L7)

## Properties

### context

• **context**: [`ErrorContext`](../modules/shared_src.md#errorcontext)

#### Defined in

[core/shared/src/GlobalError.ts:5](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L5)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.8.2/node_modules/typescript/lib/lib.es5.d.ts:1077

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/.pnpm/typescript@5.8.2/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.8.2/node_modules/typescript/lib/lib.es5.d.ts:1078

node_modules/.pnpm/@types+node@12.20.55/node_modules/@types/node/globals.d.ts:127

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@12.20.55/node_modules/@types/node/globals.d.ts:140

node_modules/.pnpm/@types+node@22.13.14/node_modules/@types/node/globals.d.ts:143

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@12.20.55/node_modules/@types/node/globals.d.ts:142

node_modules/.pnpm/@types+node@22.13.14/node_modules/@types/node/globals.d.ts:145

## Methods

### hasJson

▸ **hasJson**(): `boolean`

#### Returns

`boolean`

#### Defined in

[core/shared/src/GlobalError.ts:27](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L27)

___

### setCode

▸ **setCode**(`code?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `code?` | `number` |

#### Returns

`void`

#### Defined in

[core/shared/src/GlobalError.ts:14](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L14)

___

### setJson

▸ **setJson**(`json?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `json?` | `Record`\<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[core/shared/src/GlobalError.ts:17](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L17)

___

### setName

▸ **setName**(`name?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name?` | `string` |

#### Returns

`void`

#### Defined in

[core/shared/src/GlobalError.ts:23](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L23)

___

### setStack

▸ **setStack**(`stack?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stack?` | `string` |

#### Returns

`void`

#### Defined in

[core/shared/src/GlobalError.ts:20](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L20)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[core/shared/src/GlobalError.ts:31](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/shared/src/GlobalError.ts#L31)

___

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `Object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@12.20.55/node_modules/@types/node/globals.d.ts:133

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@22.13.14/node_modules/@types/node/globals.d.ts:136
