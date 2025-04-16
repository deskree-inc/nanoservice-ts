# NanoService CLI Commands: Build

## Table of Contents
- [Build Nanoservice](#build-nanoservice)
  - [Syntax](#build-syntax)
  - [Options](#build-options)
  - [Examples](#build-examples)
- [Deploy Nanoservice](#deploy-nanoservice)
  - [Syntax](#deploy-syntax)
  - [Options](#deploy-options)
  - [Examples](#deploy-examples)
- [Common Examples](#common-examples)
- [Troubleshooting](#troubleshooting)

---

## Build Nanoservice

### Syntax
```bash
npx nanoctl build [options]
```
  Compiles and packages a nanoservice from source code into a deployable artifact.
 
  ### Options
  | Option       | Alias | Type    | Description                | Default            |
  |--------------|-------|---------|----------------------------|--------------------|
  | `--directory`| `-d`  | string  | Source directory path      | `./nanoservice-ts` |
  | `--help`     | `-h`  | boolean | Show help                  | `false`            |
 
  ### Commands
  | Command | Description               |
  |---------|---------------------------|
  | `.`     | Build in current directory|
 
  ### Examples
  #### Build in default directory:
  ``` bash
  npx nanoctl build
  ```
  #### Build in specific directory:
  ```bash
  npx nanoctl build -d ./my-nanoservice
  ```

  #### Build in current directory:
  ```bash
  npx nanoctl build .
  ```

---
> **Note**: After executing the building command, you can proceed to deploy the nanoservice using the [deploy](./Deployment.md) command.