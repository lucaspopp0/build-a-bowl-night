# api-sdk

A TypeScript SDK for the Build-a-Bowl Night API, generated from the API's OpenAPI spec.
The code in `src/` is generated, so do not edit it by hand.

- Spec: `openapi.yaml`, written by `make spec` in `api/src` (run as part of its `make lint`)
- Generator: [`typescript`](https://openapi-generator.tech/docs/generators/typescript/), configured in `openapitools.yaml`

## Regenerating

Requires Node and Docker (the generator runs from the `openapitools/openapi-generator-cli` image).

```sh
make generate    # regenerate src/ from openapi.yaml/
make build       # compile to dist/
```

`make lint` (run by the PR check) regenerates the SDK. If the API's spec changed, the check commits the regenerated
code to the pull request branch and fails once, so the diff is reviewed.
Files the generator should not write (its `package.json`, `tsconfig.json` and README) are listed in `src/.openapi-generator-ignore`.

## Usage

```ts
import { createConfiguration, DefaultApi, ServerConfiguration } from "@build-a-bowl-night/api-sdk";

const api = new DefaultApi(
  createConfiguration({ baseServer: new ServerConfiguration("https://<function-url>", {}) }),
);
```
