package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

// newRequest builds a Function URL request for the given method and path.
func newRequest(method, path string) events.LambdaFunctionURLRequest {
	req := events.LambdaFunctionURLRequest{RawPath: path}
	req.RequestContext.HTTP.Method = method

	return req
}

// TestHandler checks the status code and body returned for known and unknown routes.
func TestHandler(t *testing.T) {
	tests := []struct {
		name       string
		method     string
		path       string
		wantStatus int
		wantBody   string
	}{
		{"health check", http.MethodGet, "/health", http.StatusOK, `{"status":"ok"}`},
		{"unknown path", http.MethodGet, "/nope", http.StatusNotImplemented, `{"error":"not implemented"}`},
		{"wrong method", http.MethodPost, "/health", http.StatusNotImplemented, `{"error":"not implemented"}`},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resp, err := handler(context.Background(), newRequest(tt.method, tt.path))
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if resp.StatusCode != tt.wantStatus {
				t.Errorf("status = %d, want %d", resp.StatusCode, tt.wantStatus)
			}

			if resp.Body != tt.wantBody {
				t.Errorf("body = %q, want %q", resp.Body, tt.wantBody)
			}
		})
	}
}
