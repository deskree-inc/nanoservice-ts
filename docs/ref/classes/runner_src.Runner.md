[blok - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / Runner

# Class: Runner

[runner/src](../modules/runner_src.md).Runner

Runner class that extends RunnerSteps to execute a series of NanoService steps.

## Hierarchy

- [`RunnerSteps`](runner_src.RunnerSteps.md)

  ↳ **`Runner`**

## Table of contents

### Constructors

- [constructor](runner_src.Runner.md#constructor)

### Properties

- [steps](runner_src.Runner.md#steps)

### Methods

- [run](runner_src.Runner.md#run)
- [runSteps](runner_src.Runner.md#runsteps)

## Constructors

### constructor

• **new Runner**(`steps?`): [`Runner`](runner_src.Runner.md)

Constructs a new Runner instance.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `steps` | `NodeBase`[] | `[]` | An array of NanoService steps to be executed. |

#### Returns

[`Runner`](runner_src.Runner.md)

#### Overrides

[RunnerSteps](runner_src.RunnerSteps.md).[constructor](runner_src.RunnerSteps.md#constructor)

#### Defined in

[core/runner/src/Runner.ts:15](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Runner.ts#L15)

## Properties

### steps

• `Private` **steps**: `NodeBase`[]

#### Defined in

[core/runner/src/Runner.ts:8](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Runner.ts#L8)

## Methods

### run

▸ **run**(`ctx`): `Promise`\<`Context`\>

Executes the series of NanoService steps with the given context.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ctx` | `Context` | The context to be passed through the steps. |

#### Returns

`Promise`\<`Context`\>

A promise that resolves to the final context after all steps have been executed.

#### Defined in

[core/runner/src/Runner.ts:26](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/Runner.ts#L26)

___

### runSteps

▸ **runSteps**(`ctx`, `steps`, `deep?`, `step_name?`): `Promise`\<`Context`\>

Executes a series of steps in the given context.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ctx` | `Context` | `undefined` | The context in which the steps are executed. |
| `steps` | `NodeBase`[] | `undefined` | An array of NanoService steps to be executed. |
| `deep` | `boolean` | `false` | A boolean indicating whether the function is being called recursively for flow steps. |
| `step_name` | `string` | `""` | The name of the current step being processed in a flow. |

#### Returns

`Promise`\<`Context`\>

A promise that resolves to the updated context after all steps have been executed.

**`Throws`**

Throws a GlobalError if any step results in an error.

#### Inherited from

[RunnerSteps](runner_src.RunnerSteps.md).[runSteps](runner_src.RunnerSteps.md#runsteps)

#### Defined in

[core/runner/src/RunnerSteps.ts:15](https://github.com/deskree-inc/blok/blob/fd59582/core/runner/src/RunnerSteps.ts#L15)
