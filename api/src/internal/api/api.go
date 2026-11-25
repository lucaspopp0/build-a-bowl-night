// Package api builds the huma API shared by the Lambda entrypoint and the OpenAPI spec generator.
package api

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/db"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/handlers"
	"github.com/lucaspopp0/go-lambda/humaserverless"
)

// New builds the huma API and registers every operation the Lambda serves.
func New(store db.Store) huma.API {
	// Create the API served through the Function URL
	api := humaserverless.NewServerless(humaserverless.ApiOpts{
		Name:    "Build-a-Bowl Night API",
		Version: "1.0.0",
	})

	// Users and ingredients CRUD endpoints
	handlers.Register(api, store)

	return api
}
