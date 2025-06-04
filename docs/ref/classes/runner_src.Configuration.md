[blok - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / Configuration

# Class: Configuration

[runner/src](../modules/runner_src.md).Configuration

## Implements

- [`Config`](../modules/runner_src.md#config)

## Table of contents

### Constructors

- [constructor](runner_src.Configuration.md#constructor)

### Properties

- [globalOptions](runner_src.Configuration.md#globaloptions)
- [name](runner_src.Configuration.md#name)
- [nodes](runner_src.Configuration.md#nodes)
- [steps](runner_src.Configuration.md#steps)
- [trigger](runner_src.Configuration.md#trigger)
- [version](runner_src.Configuration.md#version)
- [workflow](runner_src.Configuration.md#workflow)
- [loaded\_nodes](runner_src.Configuration.md#loaded_nodes)

### Methods

- [getFlow](runner_src.Configuration.md#getflow)
- [getNodes](runner_src.Configuration.md#getnodes)
- [getSteps](runner_src.Configuration.md#getsteps)
- [init](runner_src.Configuration.md#init)
- [localResolver](runner_src.Configuration.md#localresolver)
- [moduleResolver](runner_src.Configuration.md#moduleresolver)
- [nodeResolver](runner_src.Configuration.md#noderesolver)
- [nodeTypes](runner_src.Configuration.md#nodetypes)
- [runtimeResolver](runner_src.Configuration.md#runtimeresolver)

## Constructors

### constructor

• **new Configuration**(): [`Configuration`](runner_src.Configuration.md)

#### Returns

[`Configuration`](runner_src.Configuration.md)

#### Defined in

[core/runner/src/Configuration.ts:27](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L27)

## Properties

### globalOptions

• **globalOptions**: `undefined` \| [`GlobalOptions`](../modules/runner_src.md#globaloptions)

#### Defined in

[core/runner/src/Configuration.ts:25](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L25)

___

### name

• **name**: `string`

#### Implementation of

Config.name

#### Defined in

[core/runner/src/Configuration.ts:19](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L19)

___

### nodes

• **nodes**: [`Node`](../modules/runner_src.md#node)

#### Implementation of

Config.nodes

#### Defined in

[core/runner/src/Configuration.ts:22](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L22)

___

### steps

• **steps**: `NodeBase`[]

#### Implementation of

Config.steps

#### Defined in

[core/runner/src/Configuration.ts:21](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L21)

___

### trigger

• **trigger**: [`Trigger`](../modules/runner_src.md#trigger)

#### Implementation of

Config.trigger

#### Defined in

[core/runner/src/Configuration.ts:23](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L23)

___

### version

• **version**: `string`

#### Implementation of

Config.version

#### Defined in

[core/runner/src/Configuration.ts:20](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L20)

___

### workflow

• **workflow**: [`Config`](../modules/runner_src.md#config)

#### Defined in

[core/runner/src/Configuration.ts:18](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L18)

___

### loaded\_nodes

▪ `Static` **loaded\_nodes**: [`Node`](../modules/runner_src.md#node)

#### Defined in

[core/runner/src/Configuration.ts:24](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L24)

## Methods

### getFlow

▸ **getFlow**(`steps`): `Promise`\<[`Flow`](../modules/runner_src.md#flow)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `steps` | `default`[] |

#### Returns

`Promise`\<[`Flow`](../modules/runner_src.md#flow)\>

#### Defined in

[core/runner/src/Configuration.ts:147](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L147)

___

### getNodes

▸ **getNodes**(`workflow_nodes`): `Promise`\<[`Node`](../modules/runner_src.md#node)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `workflow_nodes` | [`Node`](../modules/runner_src.md#node) |

#### Returns

`Promise`\<[`Node`](../modules/runner_src.md#node)\>

#### Defined in

[core/runner/src/Configuration.ts:84](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L84)

___

### getSteps

▸ **getSteps**(`blueprint_steps`): `Promise`\<`NodeBase`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blueprint_steps` | `default`[] |

#### Returns

`Promise`\<`NodeBase`[]\>

#### Defined in

[core/runner/src/Configuration.ts:57](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L57)

___

### init

▸ **init**(`workflowNameInPath`, `opts?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `workflowNameInPath` | `string` |
| `opts?` | [`GlobalOptions`](../modules/runner_src.md#globaloptions) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[core/runner/src/Configuration.ts:35](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L35)

___

### localResolver

▸ **localResolver**(`node`): `Promise`\<`default`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `default` |

#### Returns

`Promise`\<`default`\>

#### Defined in

[core/runner/src/Configuration.ts:219](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L219)

___

### moduleResolver

▸ **moduleResolver**(`node`, `opts`): `Promise`\<`default`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `default` |
| `opts` | [`GlobalOptions`](../modules/runner_src.md#globaloptions) |

#### Returns

`Promise`\<`default`\>

#### Defined in

[core/runner/src/Configuration.ts:208](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L208)

___

### nodeResolver

▸ **nodeResolver**(`node`): `Promise`\<`default`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `default` |

#### Returns

`Promise`\<`default`\>

#### Defined in

[core/runner/src/Configuration.ts:169](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L169)

___

### nodeTypes

▸ **nodeTypes**(): `NodeResolverTypes`

#### Returns

`NodeResolverTypes`

#### Defined in

[core/runner/src/Configuration.ts:178](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L178)

___

### runtimeResolver

▸ **runtimeResolver**(`node`): `Promise`\<`default`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `default` |

#### Returns

`Promise`\<`default`\>

#### Defined in

[core/runner/src/Configuration.ts:192](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Configuration.ts#L192)
