package main

import (
	"context"
	"net/http"
	"strings"
	"testing"

	"github.com/lucaspopp0/go-lambda/middleware"

	"github.com/aws/aws-lambda-go/events"
	"github.com/danielgtaylor/huma/v2"
)

// newRequest builds a Function URL request for the given method and path.
func newRequest(method, path string) events.LambdaFunctionURLRequest {
	req := events.LambdaFunctionURLRequest{RawPath: path}
	req.RequestContext.HTTP.Method = method
	req.RequestContext.HTTP.Path = path

	return req
}

// handle runs a Function URL request through the same handler chain the Lambda uses.
func handle(api huma.API, req events.LambdaFunctionURLRequest) (events.LambdaFunctionURLResponse, error) {
	return middleware.WithTypes[events.LambdaFunctionURLRequest, events.LambdaFunctionURLResponse](newHandler(api))(context.Background(), req)
}

// TestHandler checks the status code and body returned for known and unknown routes.
func TestHandler(t *testing.T) {
	api := newAPI(newMemStore())

	tests := []struct {
		name       string
		method     string
		path       string
		wantStatus int
		wantBody   string
	}{
		{"health check", http.MethodGet, "/health", http.StatusOK, `{"status":"ok"}`},
		{"unknown path", http.MethodGet, "/nope", http.StatusNotFound, ""},
		{"wrong method", http.MethodPost, "/health", http.StatusMethodNotAllowed, ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := handle(api, newRequest(tt.method, tt.path))
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if resp.StatusCode != tt.wantStatus {
				t.Errorf("status = %d, want %d", resp.StatusCode, tt.wantStatus)
			}

			if tt.wantBody != "" && strings.TrimSpace(resp.Body) != tt.wantBody {
				t.Errorf("body = %q, want %q", resp.Body, tt.wantBody)
			}
		})
	}
}

// TestInvalidBody checks that an undecodable base64 body is rejected with a 400 instead of a 500.
func TestInvalidBody(t *testing.T) {
	req := newRequest(http.MethodPost, "/health")
	req.Body = "!!not-base64!!"
	req.IsBase64Encoded = true

	resp, err := handle(newAPI(newMemStore()), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusBadRequest)
	}
}
