# NanoService CLI Commands

## Table of Contents

---

## Deploy Blok 

### Syntax
```bash
npx blokctl deploy [options]
```


 Deploys a nanoservice to the NanoServices platform, optionally building it first.
 *
 Options:
 - `--name`, `-n` (string): Service name (required). Default: none.
 - `--build` (boolean): Build before deploying. Default: false.
 - `--directory`, `-d` (string): Source directory path. Default: Current working directory.
 - `--help`, `-h` (boolean): Show help. Default: false.
 *
 Commands:
 - `.`: Deploy from the current directory.

### Examples

#### Deploy with build:
```bash
npx blokctl deploy -n my-service --build
```

#### Deploy existing build:
```bash
npx blokctl deploy -n my-service -d ./build-output
```

#### Deploy from current directory:
```bash
npx blokctl deploy -n my-service .
```

<br />
<br />
<br />

---
# Build and Deploy Example

#### Build and deploy workflow:
```bash
# Build first
npx blokctl build -d ./src

# Then deploy
npx blokctl deploy -n my-service -d ./src
```

#### Single-command build & deploy:
```bash
npx blokctl deploy -n my-service --build
```

#### CI/CD Pipeline Example:
```bash
# In your deployment script
npx blokctl build -d $CODE_DIR
npx blokctl deploy -n $SERVICE_NAME -d $CODE_DIR
```