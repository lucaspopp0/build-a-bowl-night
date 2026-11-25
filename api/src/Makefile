# Targets invoked by the slingshot check-lambda and deploy-lambda workflows, run from this directory.
# The build output directory must match subpaths.build in .components/api/info.yml (api/dist).

BUILD_DIR := ../dist
SPEC_FILE := ../../api-sdk/openapi.yaml

.PHONY: lint unit-test build spec clean

# Formats and vets the source, and regenerates the OpenAPI spec; the workflow fails if either produced changes
lint: spec
	go fmt ./...
	go vet ./...

# Runs the unit tests
unit-test:
	go test ./...

# Compiles the Lambda executable for the provided.al2023 arm64 runtime
build:
	mkdir -p $(BUILD_DIR)
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o $(BUILD_DIR)/bootstrap ./internal/cmd/main

# Writes the OpenAPI spec (YAML) to api-sdk/openapi.yaml
spec:
	go run ./internal/cmd/openapi > $(SPEC_FILE)

# Removes build output
clean:
	rm -rf $(BUILD_DIR)
