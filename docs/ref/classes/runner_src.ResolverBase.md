[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / ResolverBase

# Class: ResolverBase

[runner/src](../modules/runner_src.md).ResolverBase

## Hierarchy

- **`ResolverBase`**

  ↳ [`LocalStorage`](runner_src.LocalStorage.md)

## Table of contents

### Constructors

- [constructor](runner_src.ResolverBase.md#constructor)

### Methods

- [createContext](runner_src.ResolverBase.md#createcontext)
- [get](runner_src.ResolverBase.md#get)

## Constructors

### constructor

• **new ResolverBase**(): [`ResolverBase`](runner_src.ResolverBase.md)

#### Returns

[`ResolverBase`](runner_src.ResolverBase.md)

## Methods

### createContext

▸ **createContext**(`logger?`): `Context`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | `any` |

#### Returns

`Context`

#### Defined in

[core/runner/src/ResolverBase.ts:9](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ResolverBase.ts#L9)

___

### get

▸ **get**(`name`, `workflow`): `Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `workflow` | `WorkflowLocator` |

#### Returns

`Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Defined in

[core/runner/src/ResolverBase.ts:7](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ResolverBase.ts#L7)
