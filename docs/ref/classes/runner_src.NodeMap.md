[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / NodeMap

# Class: NodeMap

[runner/src](../modules/runner_src.md).NodeMap

## Table of contents

### Constructors

- [constructor](runner_src.NodeMap.md#constructor)

### Properties

- [nodes](runner_src.NodeMap.md#nodes)

### Methods

- [addNode](runner_src.NodeMap.md#addnode)
- [getNode](runner_src.NodeMap.md#getnode)
- [getNodes](runner_src.NodeMap.md#getnodes)

## Constructors

### constructor

• **new NodeMap**(): [`NodeMap`](runner_src.NodeMap.md)

#### Returns

[`NodeMap`](runner_src.NodeMap.md)

## Properties

### nodes

• **nodes**: `Map`\<`string`, `NodeBase`\>

#### Defined in

[core/runner/src/NodeMap.ts:4](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/NodeMap.ts#L4)

## Methods

### addNode

▸ **addNode**(`name`, `node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `node` | `NodeBase` |

#### Returns

`void`

#### Defined in

[core/runner/src/NodeMap.ts:6](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/NodeMap.ts#L6)

___

### getNode

▸ **getNode**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`any`

#### Defined in

[core/runner/src/NodeMap.ts:10](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/NodeMap.ts#L10)

___

### getNodes

▸ **getNodes**(): `Map`\<`string`, `NodeBase`\>

#### Returns

`Map`\<`string`, `NodeBase`\>

#### Defined in

[core/runner/src/NodeMap.ts:14](https://github.com/deskree-inc/nanoservice-ts/blob/7f88d40/core/runner/src/NodeMap.ts#L14)
