package main

import (
	"context"
	"net/http"
	"strings"
	"testing"

	"github.com/lucaspopp0/build-a-bowl-night/api/internal/api"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/db"
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
	api := api.New(db.NewMemStore())

	tests := []struct {
		name       string
		method     string
		path       string
		wantStatus int
		wantBody   string
	}{
		{"list users", http.MethodGet, "/users", http.StatusOK, `{"users":[]}`},
		{"unknown path", http.MethodGet, "/nope", http.StatusNotFound, ""},
		{"wrong method", http.MethodPost, "/users", http.StatusMethodNotAllowed, ""},
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
	req := newRequest(http.MethodPost, "/users")
	req.Body = "!!not-base64!!"
	req.IsBase64Encoded = true

	resp, err := handle(api.New(db.NewMemStore()), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusBadRequest)
	}
}

// TestCRUD walks users and ingredients through list, put, get and delete, including cascading deletes.
func TestCRUD(t *testing.T) {
	api := api.New(db.NewMemStore())

	// Each step sends a request and checks the status and a fragment of the body
	steps := []struct {
		name, method, path, body string
		wantStatus               int
		wantBody                 string
	}{
		{"empty users", "GET", "/users", "", 200, `{"users":[]}`},
		{"missing user", "GET", "/users/555", "", 404, ""},
		{"create user", "PUT", "/users/555", `{"name":"Ann"}`, 200, `"name":"Ann"`},
		{"update user", "PUT", "/users/555", `{"name":"Anne"}`, 200, `"name":"Anne"`},
		{"blank name rejected", "PUT", "/users/555", `{"name":""}`, 422, ""},
		{"list users", "GET", "/users", "", 200, `"phone":"555"`},
		{"ingredient needs user", "PUT", "/users/999/ingredients/a", `{"category":"protein","name":"Tofu"}`, 404, ""},
		{"create ingredient", "PUT", "/users/555/ingredients/a", `{"category":"protein","name":"Tofu"}`, 200, `"id":"a"`},
		{"post needs user", "POST", "/users/999/ingredients", `{"category":"x","name":"y"}`, 404, ""},
		{"post ingredient", "POST", "/users/555/ingredients", `{"category":"sauce","name":"Sriracha"}`, 201, `"name":"Sriracha"`},
		{"create second ingredient", "PUT", "/users/555/ingredients/b", `{"category":"topping","name":"Nori"}`, 200, ""},
		{"get ingredient", "GET", "/users/555/ingredients/a", "", 200, `"name":"Tofu"`},
		{"list all ingredients", "GET", "/ingredients", "", 200, `"name":"Nori"`},
		{"list user ingredients", "GET", "/users/555/ingredients", "", 200, `"name":"Tofu"`},
		{"delete ingredient", "DELETE", "/users/555/ingredients/a", "", 204, ""},
		{"delete ingredient again", "DELETE", "/users/555/ingredients/a", "", 404, ""},
		{"delete user cascades", "DELETE", "/users/555", "", 204, ""},
		{"user gone", "GET", "/users/555", "", 404, ""},
		{"ingredients gone", "GET", "/ingredients", "", 200, `{"ingredients":[]}`},
	}

	for _, s := range steps {
		t.Run(s.name, func(t *testing.T) {
			req := newRequest(s.method, s.path)
			req.Body = s.body
			req.Headers = map[string]string{"content-type": "application/json"}

			resp, err := handle(api, req)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if resp.StatusCode != s.wantStatus {
				t.Fatalf("status = %d, want %d (body %s)", resp.StatusCode, s.wantStatus, resp.Body)
			}

			if !strings.Contains(resp.Body, s.wantBody) {
				t.Errorf("body = %q, want it to contain %q", resp.Body, s.wantBody)
			}
		})
	}

}
