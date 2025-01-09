# Configuration Options
The IfElse node allows you to have a conditional statement and call other nodes depending on the conditions

## Node properties

### Required properties
- `conditions` (array): List of conditions to check
    - `type` (string if | else): type of the condition
    - `condition` (string): The condition string to be checked
    - `steps` (array):  List of steps to execute if the condition is true


## Usage/Examples
### Step Configuration

```json
{
    "name": "if-else",
    "node": "if-else@1.0.0",
    "type": "local"
}
```

### Node Configuration


```json
"if-else": {
    "conditions": [
        {
            "type": "if",
            "condition": "data !== undefined",
            "steps": []
        },
        {
            "type": "else",
            "steps": []
        }
    ]
}
```

