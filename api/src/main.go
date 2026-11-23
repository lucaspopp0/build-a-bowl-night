// Package main is the Lambda entrypoint for the Build-a-Bowl Night API, served through a Function URL.
package main

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// handler routes a Function URL request to the matching API operation, currently only a health check.
func handler(_ context.Context, req events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
	// Health check used to confirm the deployment is reachable
	if req.RequestContext.HTTP.Method == http.MethodGet && req.RawPath == "/health" {
		return jsonResponse(http.StatusOK, `{"status":"ok"}`), nil
	}

	// Everything else is not built yet
	return jsonResponse(http.StatusNotImplemented, `{"error":"not implemented"}`), nil
}

// jsonResponse builds a Function URL response with a JSON body and the given status code.
func jsonResponse(status int, body string) events.LambdaFunctionURLResponse {
	return events.LambdaFunctionURLResponse{
		StatusCode: status,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       body,
	}
}

// main starts the Lambda runtime with the request handler.
func main() {
	lambda.Start(handler)
}
