[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / ConfigurationResolver

# Class: ConfigurationResolver

[runner/src](../modules/runner_src.md).ConfigurationResolver

## Table of contents

### Constructors

- [constructor](runner_src.ConfigurationResolver.md#constructor)

### Properties

- [globalOptions](runner_src.ConfigurationResolver.md#globaloptions)
- [targets](runner_src.ConfigurationResolver.md#targets)

### Methods

- [get](runner_src.ConfigurationResolver.md#get)

## Constructors

### constructor

• **new ConfigurationResolver**(`opts`): [`ConfigurationResolver`](runner_src.ConfigurationResolver.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`GlobalOptions`](../modules/runner_src.md#globaloptions) |

#### Returns

[`ConfigurationResolver`](runner_src.ConfigurationResolver.md)

#### Defined in

[core/runner/src/ConfigurationResolver.ts:9](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ConfigurationResolver.ts#L9)

## Properties

### globalOptions

• `Private` **globalOptions**: [`GlobalOptions`](../modules/runner_src.md#globaloptions)

#### Defined in

[core/runner/src/ConfigurationResolver.ts:7](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ConfigurationResolver.ts#L7)

___

### targets

• `Private` **targets**: [`Targets`](../modules/runner_src.md#targets) = `{}`

#### Defined in

[core/runner/src/ConfigurationResolver.ts:6](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ConfigurationResolver.ts#L6)

## Methods

### get

▸ **get**(`target`, `name`): `Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `string` |
| `name` | `string` |

#### Returns

`Promise`\<[`Config`](../modules/runner_src.md#config)\>

#### Defined in

[core/runner/src/ConfigurationResolver.ts:17](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/ConfigurationResolver.ts#L17)
