# Configuration Options
The ApiCall node allows you to make an API call to any API endpoint


## Node properties

### Required properties
- `url *` (string): A string representing the MongoDB connection string. (Required)
- `method *` (string): The name of the MongoDB database to delete. (Required)

### Optional properties

- `headers` (Object): The headers of the request.
- `body` (object): the body of the request.
- `responseType` (string): the response type of the request.

## Usage/Examples
### Step Configuration

```json
{
    "name": "api-call",
    "node": "api-call@1.0.0",
    "type": "local"
}
```

### Node Configuration
```json
"api-call": {
    "inputs": {
        "properties": {
            "url": "https://bp-firestore-stack.api-dev.deskree.com/api/v1/auth/accounts/sign-in/email",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer ${ctx.vars.authApiResponse.data.idToken}"
            },
            "body": {
                "email": "email@email.com",
                "password": "123password"
            }
        }
    }
}
```

