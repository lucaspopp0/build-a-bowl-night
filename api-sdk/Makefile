# Targets invoked by the slingshot check-library workflow, run from this directory.

.PHONY: install generate lint unit-test build

# Installs the generator, TypeScript and runtime dependencies
install:
	npm ci

# Regenerates src/ from the OpenAPI spec (needs Java for the generator)
generate: install
	rm -rf src/apis src/auth src/http src/models src/types
	npm run generate

# Regenerates the SDK so the workflow can detect (and commit) drift from the spec
lint: generate

# Type-checks the generated SDK; there is no hand-written logic to test
unit-test: install
	npm run build

# Compiles the SDK into dist/
build: install
	npm run build
