# Targets invoked by the slingshot check-library workflow, run from this directory.

# Generator image; keep the version in sync with the generator used to produce src/
GENERATOR_IMAGE := openapitools/openapi-generator-cli:v7.27.0

.PHONY: install generate lint unit-test build

# Installs TypeScript and runtime dependencies
install:
	npm ci

# Regenerates src/ from openapi.yaml with the generator docker image (needs docker)
generate: install
	find src -name "*.ts" -type f -delete
	docker run --rm --user "$$(id -u):$$(id -g)" -v "$(CURDIR):/local" -w /local \
		$(GENERATOR_IMAGE) generate -c openapitools.yaml

# Regenerates the SDK so the workflow can detect (and commit) drift from the spec
lint: generate

# Type-checks the generated SDK; there is no hand-written logic to test
unit-test: install
	npm run build

# Compiles the SDK into dist/
build: install
	npm run build
