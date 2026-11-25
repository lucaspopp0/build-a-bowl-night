package main

import (
	"strings"
	"testing"
)

// TestCRUD walks users and ingredients through list, put, get and delete, including conflicts and cascading deletes.
func TestCRUD(t *testing.T) {
	api := newAPI(newMemStore())

	// Each step sends a request and checks the status and a fragment of the body
	steps := []struct {
		name, method, path, body string
		wantStatus               int
		wantBody                 string
	}{
		{"empty users", "GET", "/users", "", 200, `{"users":[]}`},
		{"missing user", "GET", "/users/555", "", 404, ""},
		{"create user", "PUT", "/users/555", `{"name":"Ann"}`, 200, `"version":1`},
		{"update user", "PUT", "/users/555", `{"name":"Anne","version":1}`, 200, `"name":"Anne"`},
		{"stale update conflicts", "PUT", "/users/555", `{"name":"Old","version":1}`, 409, ""},
		{"must-not-exist conflicts", "PUT", "/users/555", `{"name":"X","version":0}`, 409, ""},
		{"blank name rejected", "PUT", "/users/555", `{"name":""}`, 422, ""},
		{"list users", "GET", "/users", "", 200, `"phone":"555"`},
		{"ingredient needs user", "PUT", "/users/999/ingredients/a", `{"category":"protein","name":"Tofu"}`, 404, ""},
		{"create ingredient", "PUT", "/users/555/ingredients/a", `{"category":"protein","name":"Tofu"}`, 200, `"id":"a"`},
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
