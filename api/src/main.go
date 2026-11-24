// Package main is the Lambda entrypoint for the Build-a-Bowl Night API, served through a Function URL.
package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/go-lambda/humaserverless"
)

// HealthOutput is the response body of the health check operation.
type HealthOutput struct {
	Body struct {
		Status string `json:"status" example:"ok" doc:"Always ok when the API is reachable"`
	}
}

// newAPI builds the huma API and registers every operation the Lambda serves.
func newAPI() huma.API {
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
	}, func(_ context.Context, _ *struct{}) (*HealthOutput, error) {
		out := &HealthOutput{}
		out.Body.Status = "ok"

		return out, nil
	})

	return api
}

// main starts the Lambda runtime, serving Function URL requests through the huma API.
func main() {
	api := newAPI()

	lambda.Start(func(ctx context.Context, e events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
		return humaserverless.FunctionURLHandler(ctx, api, e)
	})
}
