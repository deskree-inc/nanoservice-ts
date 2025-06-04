[blok - v0.1.0](../README.md) / [shared/src](../modules/shared_src.md) / MemoryUsage

# Class: MemoryUsage

[shared/src](../modules/shared_src.md).MemoryUsage

## Hierarchy

- `default`

  ↳ **`MemoryUsage`**

## Table of contents

### Constructors

- [constructor](shared_src.MemoryUsage.md#constructor)

### Properties

- [counter](shared_src.MemoryUsage.md#counter)
- [max\_val](shared_src.MemoryUsage.md#max_val)
- [min\_val](shared_src.MemoryUsage.md#min_val)
- [total\_val](shared_src.MemoryUsage.md#total_val)

### Methods

- [clear](shared_src.MemoryUsage.md#clear)
- [getMetrics](shared_src.MemoryUsage.md#getmetrics)
- [start](shared_src.MemoryUsage.md#start)
- [stop](shared_src.MemoryUsage.md#stop)

## Constructors

### constructor

• **new MemoryUsage**(): [`MemoryUsage`](shared_src.MemoryUsage.md)

#### Returns

[`MemoryUsage`](shared_src.MemoryUsage.md)

#### Inherited from

MetricsBase.constructor

## Properties

### counter

• `Protected` **counter**: `number` = `0`

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:9](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L9)

___

### max\_val

• `Protected` **max\_val**: `number` = `0`

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:7](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L7)

___

### min\_val

• `Protected` **min\_val**: `number` = `0`

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:6](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L6)

___

### total\_val

• `Protected` **total\_val**: `number` = `0`

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:8](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L8)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:36](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L36)

___

### getMetrics

▸ **getMetrics**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `global_free_memory` | `number` |
| `global_memory` | `number` |
| `max` | `number` |
| `min` | `number` |
| `total` | `number` |

#### Overrides

MetricsBase.getMetrics

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:26](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L26)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Overrides

MetricsBase.start

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:11](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L11)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Overrides

MetricsBase.stop

#### Defined in

[core/shared/src/utils/MemoryUsage.ts:24](https://github.com/deskree-inc/blok/blob/fd59582/core/shared/src/utils/MemoryUsage.ts#L24)
