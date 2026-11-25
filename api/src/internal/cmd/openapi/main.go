// Package main loads the Build-a-Bowl Night OpenAPI spec and prints it to stdout.
package main

import (
	"fmt"
	"log"

	"github.com/lucaspopp0/build-a-bowl-night/api/internal/api"
)

// main prints the OpenAPI spec as JSON. No operation runs, so no store is needed.
func main() {
	spec, err := api.New(nil).OpenAPI().MarshalJSON()
	if err != nil {
		log.Fatalf("marshaling OpenAPI spec: %v", err)
	}

	fmt.Println(string(spec))
}
