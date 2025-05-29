[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / TriggerBase

# Class: TriggerBase

[runner/src](../modules/runner_src.md).TriggerBase

## Hierarchy

- `unknown`

  ↳ **`TriggerBase`**

## Table of contents

### Constructors

- [constructor](runner_src.TriggerBase.md#constructor)

### Properties

- [configuration](runner_src.TriggerBase.md#configuration)

### Methods

- [createContext](runner_src.TriggerBase.md#createcontext)
- [endCounter](runner_src.TriggerBase.md#endcounter)
- [getConfiguration](runner_src.TriggerBase.md#getconfiguration)
- [getRunner](runner_src.TriggerBase.md#getrunner)
- [listen](runner_src.TriggerBase.md#listen)
- [run](runner_src.TriggerBase.md#run)
- [startCounter](runner_src.TriggerBase.md#startcounter)

## Constructors

### constructor

• **new TriggerBase**(): [`TriggerBase`](runner_src.TriggerBase.md)

#### Returns

[`TriggerBase`](runner_src.TriggerBase.md)

#### Overrides

Trigger.constructor

#### Defined in

[core/runner/src/TriggerBase.ts:12](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L12)

## Properties

### configuration

• **configuration**: [`Configuration`](runner_src.Configuration.md)

#### Defined in

[core/runner/src/TriggerBase.ts:10](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L10)

## Methods

### createContext

▸ **createContext**(`logger?`, `blueprintPath?`, `id?`): `Context`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger?` | `any` |
| `blueprintPath?` | `string` |
| `id?` | `string` |

#### Returns

`Context`

#### Defined in

[core/runner/src/TriggerBase.ts:90](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L90)

___

### endCounter

▸ **endCounter**(`start`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `start` | `number` |

#### Returns

`number`

#### Defined in

[core/runner/src/TriggerBase.ts:122](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L122)

___

### getConfiguration

▸ **getConfiguration**(): [`Configuration`](runner_src.Configuration.md)

#### Returns

[`Configuration`](runner_src.Configuration.md)

#### Defined in

[core/runner/src/TriggerBase.ts:19](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L19)

___

### getRunner

▸ **getRunner**(): [`Runner`](runner_src.Runner.md)

#### Returns

[`Runner`](runner_src.Runner.md)

#### Defined in

[core/runner/src/TriggerBase.ts:23](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L23)

___

### listen

▸ **listen**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Defined in

[core/runner/src/TriggerBase.ts:17](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L17)

___

### run

▸ **run**(`ctx`): `Promise`\<[`TriggerResponse`](../modules/runner_src.md#triggerresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |

#### Returns

`Promise`\<[`TriggerResponse`](../modules/runner_src.md#triggerresponse)\>

#### Defined in

[core/runner/src/TriggerBase.ts:27](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L27)

___

### startCounter

▸ **startCounter**(): `number`

#### Returns

`number`

#### Defined in

[core/runner/src/TriggerBase.ts:118](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/TriggerBase.ts#L118)
