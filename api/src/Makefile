# Targets invoked by the slingshot check-lambda and deploy-lambda workflows, run from this directory.
# The build output directory must match subpaths.build in .components/api/info.yml (api/dist).

BUILD_DIR := ../dist

.PHONY: lint unit-test build clean

# Formats and vets the source; the workflow fails if formatting produced changes
lint:
	go fmt ./...
	go vet ./...

# Runs the unit tests
unit-test:
	go test ./...

# Compiles the Lambda executable for the provided.al2023 arm64 runtime
build:
	mkdir -p $(BUILD_DIR)
	GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o $(BUILD_DIR)/bootstrap ./internal/cmd

# Removes build output
clean:
	rm -rf $(BUILD_DIR)
