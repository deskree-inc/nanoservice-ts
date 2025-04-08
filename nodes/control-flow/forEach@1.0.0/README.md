# ForEach Node

Iterates over a collection (array or object), executing specified steps for each item.

## Configuration

### Required Parameters
- **collection**: The array or object to iterate over
- **steps**: Array of steps to execute for each item

### Optional Parameters
- **execution**: Execution mode (`sequential` or `parallel`, default: `sequential`)
- **concurrency**: Maximum concurrent executions in parallel mode (default: 5)
- **errorHandling**: Behavior when errors occur (`continue` or `stop`, default: `continue`)

## Examples

### Basic Usage
```json
{
  "collection": [1, 2, 3],
  "steps": [
    {
      "name": "logItem",
      "node": "console-log@1.0.0"
    }
  ]
}
```

### Parallel Execution
```json
{
  "collection": ["item1", "item2", "item3"],
  "steps": [
    {
      "name": "processItem",
      "node": "api-call@1.0.0"
    }
  ],
  "execution": "parallel",
  "concurrency": 3
}
```

### Error Handling
```json
{
  "collection": ["data1", "data2", "data3"],
  "steps": [
    {
      "name": "transformItem",
      "node": "data-transform@1.0.0"
    }
  ],
  "errorHandling": "stop"
}
```

## Context Variables
During execution, these variables are available in the context:
- `item`: Current item value
- `itemKey`: Current item key/index
- `itemIndex`: Current item index (only for arrays)
