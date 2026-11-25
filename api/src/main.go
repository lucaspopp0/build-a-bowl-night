// Package main is the Lambda entrypoint for the Build-a-Bowl Night API, served through a Function URL.
package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"net/http/httptest"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/db"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/handlers"
	"github.com/lucaspopp0/go-lambda/eventwrappers"
	"github.com/lucaspopp0/go-lambda/humaserverless"
	"github.com/lucaspopp0/go-lambda/middleware"
)

// HealthOutput is the response body of the health check operation.
type HealthOutput struct {
	Body struct {
		Status string `json:"status" example:"ok" doc:"Always ok when the API is reachable"`
	}
}

// newAPI builds the huma API and registers every operation the Lambda serves.
func newAPI(store db.Store) huma.API {
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
		Tags:        []string{"Health"},
	}, func(_ context.Context, _ *struct{}) (*HealthOutput, error) {
		out := &HealthOutput{}
		out.Body.Status = "ok"

		return out, nil
	})

	// Users and ingredients CRUD endpoints
	handlers.Register(api, store)

	return api
}

// newHandler serves requests through the huma API, wrapped in request/response logging.
// CORS is handled by the Function URL configuration, so no CORS middleware is used.
func newHandler(api huma.API) middleware.HandlerFunc {
	return middleware.WithLogger(func(ctx context.Context, req eventwrappers.HttpRequest) (eventwrappers.HttpResponse, error) {
		// Convert the event into a standard HTTP request, rejecting bodies that can't be decoded
		httpReq, err := req.ToHttpRequest()
		if err != nil {
			status := http.StatusInternalServerError
			if errors.Is(err, eventwrappers.ErrInvalidBody) {
				status = http.StatusBadRequest
			}

			resp := eventwrappers.NewFunctionURLResponse(nil)
			resp.SetStatusCode(status)
			resp.SetBody(err.Error())

			return resp, nil
		}

		// Serve the request with the huma API and copy the result into a Function URL response
		rec := httptest.NewRecorder()
		api.Adapter().ServeHTTP(rec, httpReq.WithContext(ctx))

		resp := eventwrappers.NewFunctionURLResponse(nil)
		resp.FromHttpResponse(rec.Code, rec.Header(), rec.Body.Bytes())

		return resp, nil
	})
}

// main starts the Lambda runtime, serving Function URL requests through the huma API.
func main() {
	// Connect to the tables named by the Lambda's environment
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatalf("loading AWS config: %v", err)
	}

	store := db.NewDynamoStore(dynamodb.NewFromConfig(cfg), os.Getenv("USERS_TABLE"), os.Getenv("INGREDIENTS_TABLE"))

	lambda.Start(middleware.WithTypes[events.LambdaFunctionURLRequest, events.LambdaFunctionURLResponse](newHandler(newAPI(store))))
}
