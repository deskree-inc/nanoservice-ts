[nanoservice-ts - v0.1.0](../README.md) / [runner/src](../modules/runner_src.md) / RunnerSteps

# Class: RunnerSteps

[runner/src](../modules/runner_src.md).RunnerSteps

## Hierarchy

- **`RunnerSteps`**

  ↳ [`Runner`](runner_src.Runner.md)

## Table of contents

### Constructors

- [constructor](runner_src.RunnerSteps.md#constructor)

### Methods

- [runSteps](runner_src.RunnerSteps.md#runsteps)

## Constructors

### constructor

• **new RunnerSteps**(): [`RunnerSteps`](runner_src.RunnerSteps.md)

#### Returns

[`RunnerSteps`](runner_src.RunnerSteps.md)

## Methods

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

#### Defined in

[core/runner/src/RunnerSteps.ts:15](https://github.com/deskree-inc/nanoservice-ts/blob/fd59582/core/runner/src/RunnerSteps.ts#L15)
