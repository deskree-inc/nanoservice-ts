# NanoCTL Login Command

## Table of Contents

1. [Authentication Methods](#authentication-methods)  
    - [Environment Variable](#1-environment-variable)  
    - [Token Flag](#2-token-flag)  
    - [Interactive Prompt](#3-interactive-prompt)  
2. [How to Logout](#how-to-logout)  

## Authentication Methods

### 1. Environment Variable
   - **Best for**: Automated environments, CI/CD pipelines

        **Usage**:
        ```bash
        export NANOSERVICES_TOKEN="your_api_token_here"
        npx blokctl@latest login
        ```

        **Behavior**:
        - Automatically detects `NANOSERVICES_TOKEN` from the environment.
        - Non-interactive - runs silently.
        - Returns exit code `0` on success, non-zero on failure.
        - Token is not stored locally (uses the environment variable each time).
        
### 2. Token Flag
   - **Best for**: Temporary sessions, quick testing

        **Usage**:
        ```bash
        npx blokctl@latest login --token "your_api_token_here"
        npx blokctl@latest login -t "your_api_token_here"
        ```

        **Behavior**:
        - Immediately authenticates with the provided token.
        - Token is not saved to disk.
        - Shows authentication result message.
        - Recommended to wrap the token in quotes to prevent shell history logging.

### 3. Interactive Prompt
  - **Best for**: First-time setup, most secure local use
    **Usage**:
    ```bash
    npx blokctl@latest login
    ```

    **Interactive Flow**:
    - **Command launches prompt**:
    ```bash
    ◆ Please provide the token for authentication. You can create it on https://atomic.deskree.com/auth/access/token █
    ```
    Input is masked while typing.
    - **Token is validated immediately**:
        - **On success**:
            - Token is encrypted and stored.
            - Displays welcome message with username and expiration date.
        - **On failure**:
            - Shows specific error (e.g., invalid token, network issue).


## How to logout

```bash
npx blokctl@latest logout
```

Removes the authentication token from the local machine.

This function is used to delete the stored token, ensuring that 
the user is logged out or the token is no longer accessible 
from the current environment.