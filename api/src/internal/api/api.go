// Package api builds the huma API shared by the Lambda entrypoint and the OpenAPI spec generator.
package api

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/db"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/handlers"
	"github.com/lucaspopp0/go-lambda/humaserverless"
)

// HealthOutput is the response body of the health check operation.
type HealthOutput struct {
	Body struct {
		Status string `json:"status" example:"ok" doc:"Always ok when the API is reachable"`
	}
}

// New builds the huma API and registers every operation the Lambda serves.
func New(store db.Store) huma.API {
	// Create the API served through the Function URL
	api := humaserverless.NewServerless(humaserverless.ApiOpts{
		Name:    "Build-a-Bowl Night API",
		Version: "1.0.0",
	})

	// Health check used to confirm the deployment is reachable
	huma.Register(api, huma.Operation{
		OperationID: "health",
		Method:      http.MethodGet,
		Path:        "/health",
		Summary:     "Health check",
		Tags:        []string{handlers.TagHealth},
	}, func(_ context.Context, _ *struct{}) (*HealthOutput, error) {
		out := &HealthOutput{}
		out.Body.Status = "ok"

		return out, nil
	})

	// Users and ingredients CRUD endpoints
	handlers.Register(api, store)

	return api
}
