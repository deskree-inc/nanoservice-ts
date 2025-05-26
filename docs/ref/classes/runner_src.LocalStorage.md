[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / LocalStorage

# Class: LocalStorage

[runner/src](../modules/runner_src.md).LocalStorage

## Hierarchy

- [`ResolverBase`](runner_src.ResolverBase.md)

  ↳ **`LocalStorage`**

## Table of contents

### Constructors

- [constructor](runner_src.LocalStorage.md#constructor)

### Properties

- [fileTypes](runner_src.LocalStorage.md#filetypes)

### Methods

- [createContext](runner_src.LocalStorage.md#createcontext)
- [get](runner_src.LocalStorage.md#get)

## Constructors

### constructor

• **new LocalStorage**(): [`LocalStorage`](runner_src.LocalStorage.md)

#### Returns

[`LocalStorage`](runner_src.LocalStorage.md)

#### Inherited from

[ResolverBase](runner_src.ResolverBase.md).[constructor](runner_src.ResolverBase.md#constructor)

## Properties

### fileTypes

• `Protected` **fileTypes**: `string`[]

#### Defined in

[core/runner/src/LocalStorage.ts:11](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/LocalStorage.ts#L11)

## Methods

### createContext

▸ **createContext**(`logger?`): `Context`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | `any` |

#### Returns

`Context`

#### Inherited from

[ResolverBase](runner_src.ResolverBase.md).[createContext](runner_src.ResolverBase.md#createcontext)

#### Defined in

[core/runner/src/ResolverBase.ts:9](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/ResolverBase.ts#L9)

___

### get

▸ **get**(`name`, `workflowLocator`, `fileType?`): `Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `workflowLocator` | `WorkflowLocator` |
| `fileType?` | `string` |

#### Returns

`Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Overrides

[ResolverBase](runner_src.ResolverBase.md).[get](runner_src.ResolverBase.md#get)

#### Defined in

[core/runner/src/LocalStorage.ts:13](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/LocalStorage.ts#L13)
