package main

import (
	"context"
	"errors"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

// UsersOutput is the response body listing users.
type UsersOutput struct {
	Body struct {
		Users []User `json:"users"`
	}
}

// UserOutput is the response body for a single user.
type UserOutput struct {
	Body User
}

// PhoneInput carries the phone number path parameter.
type PhoneInput struct {
	Phone string `path:"phone" minLength:"1" maxLength:"32" doc:"Phone number of the user"`
}

// PutUserInput is the request of the user upsert operation.
type PutUserInput struct {
	PhoneInput
	Body struct {
		Name    string `json:"name" minLength:"1" maxLength:"200" doc:"Display name"`
		Version *int   `json:"version,omitempty" minimum:"0" doc:"Version last read, for optimistic concurrency; 0 means the user must not exist yet. Omit to overwrite."`
	}
}

// IngredientsOutput is the response body listing ingredients.
type IngredientsOutput struct {
	Body struct {
		Ingredients []Ingredient `json:"ingredients"`
	}
}

// IngredientOutput is the response body for a single ingredient.
type IngredientOutput struct {
	Body Ingredient
}

// IngredientInput carries the path parameters identifying an ingredient.
type IngredientInput struct {
	PhoneInput
	ID string `path:"id" minLength:"1" maxLength:"64" doc:"Identifier of the ingredient, chosen by the client"`
}

// PutIngredientInput is the request of the ingredient upsert operation.
type PutIngredientInput struct {
	IngredientInput
	Body struct {
		Category string `json:"category" minLength:"1" maxLength:"100" doc:"Kind of ingredient, such as protein or topping"`
		Name     string `json:"name" minLength:"1" maxLength:"200" doc:"What is being brought"`
		Version  *int   `json:"version,omitempty" minimum:"0" doc:"Version last read, for optimistic concurrency; 0 means the ingredient must not exist yet. Omit to overwrite."`
	}
}

// toHTTPError maps store errors onto the matching HTTP error responses.
func toHTTPError(err error) error {
	switch {
	case errors.Is(err, ErrNotFound):
		return huma.Error404NotFound("not found")
	case errors.Is(err, ErrConflict):
		return huma.Error409Conflict("the item was changed by someone else; re-read it and retry")
	default:
		return huma.Error500InternalServerError("internal error")
	}
}

// registerRoutes registers the users and ingredients endpoints, backed by the given store.
func registerRoutes(api huma.API, store Store) {
	// List all users
	huma.Register(api, huma.Operation{
		OperationID: "list-users", Method: http.MethodGet, Path: "/users", Summary: "List users",
	}, func(ctx context.Context, _ *struct{}) (*UsersOutput, error) {
		users, err := store.ListUsers(ctx)
		if err != nil {
			return nil, toHTTPError(err)
		}

		out := &UsersOutput{}
		out.Body.Users = users

		return out, nil
	})

	// Get one user by phone number
	huma.Register(api, huma.Operation{
		OperationID: "get-user", Method: http.MethodGet, Path: "/users/{phone}", Summary: "Get a user",
	}, func(ctx context.Context, in *PhoneInput) (*UserOutput, error) {
		u, err := store.GetUser(ctx, in.Phone)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &UserOutput{Body: u}, nil
	})

	// Create or update a user
	huma.Register(api, huma.Operation{
		OperationID: "put-user", Method: http.MethodPut, Path: "/users/{phone}", Summary: "Create or update a user",
		Errors: []int{http.StatusConflict},
	}, func(ctx context.Context, in *PutUserInput) (*UserOutput, error) {
		u, err := store.PutUser(ctx, User{Phone: in.Phone, Name: in.Body.Name}, in.Body.Version)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &UserOutput{Body: u}, nil
	})

	// Delete a user together with all of their ingredients
	huma.Register(api, huma.Operation{
		OperationID: "delete-user", Method: http.MethodDelete, Path: "/users/{phone}", Summary: "Delete a user and their ingredients",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *PhoneInput) (*struct{}, error) {
		// Make sure the user exists first so a missing user is a 404
		if _, err := store.GetUser(ctx, in.Phone); err != nil {
			return nil, toHTTPError(err)
		}

		// Remove the user's ingredients so none are orphaned
		items, err := store.ListIngredients(ctx, in.Phone)
		if err != nil {
			return nil, toHTTPError(err)
		}

		for _, i := range items {
			if err := store.DeleteIngredient(ctx, i.User, i.ID); err != nil && !errors.Is(err, ErrNotFound) {
				return nil, toHTTPError(err)
			}
		}

		if err := store.DeleteUser(ctx, in.Phone); err != nil && !errors.Is(err, ErrNotFound) {
			return nil, toHTTPError(err)
		}

		return nil, nil
	})

	// List every ingredient being brought
	huma.Register(api, huma.Operation{
		OperationID: "list-ingredients", Method: http.MethodGet, Path: "/ingredients", Summary: "List all ingredients",
	}, func(ctx context.Context, _ *struct{}) (*IngredientsOutput, error) {
		items, err := store.ListIngredients(ctx, "")
		if err != nil {
			return nil, toHTTPError(err)
		}

		out := &IngredientsOutput{}
		out.Body.Ingredients = items

		return out, nil
	})

	// List the ingredients of one user
	huma.Register(api, huma.Operation{
		OperationID: "list-user-ingredients", Method: http.MethodGet, Path: "/users/{phone}/ingredients", Summary: "List a user's ingredients",
	}, func(ctx context.Context, in *PhoneInput) (*IngredientsOutput, error) {
		if _, err := store.GetUser(ctx, in.Phone); err != nil {
			return nil, toHTTPError(err)
		}

		items, err := store.ListIngredients(ctx, in.Phone)
		if err != nil {
			return nil, toHTTPError(err)
		}

		out := &IngredientsOutput{}
		out.Body.Ingredients = items

		return out, nil
	})

	// Get one ingredient of a user
	huma.Register(api, huma.Operation{
		OperationID: "get-ingredient", Method: http.MethodGet, Path: "/users/{phone}/ingredients/{id}", Summary: "Get an ingredient",
	}, func(ctx context.Context, in *IngredientInput) (*IngredientOutput, error) {
		i, err := store.GetIngredient(ctx, in.Phone, in.ID)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &IngredientOutput{Body: i}, nil
	})

	// Create or update an ingredient of an existing user
	huma.Register(api, huma.Operation{
		OperationID: "put-ingredient", Method: http.MethodPut, Path: "/users/{phone}/ingredients/{id}", Summary: "Create or update an ingredient",
		Errors: []int{http.StatusNotFound, http.StatusConflict},
	}, func(ctx context.Context, in *PutIngredientInput) (*IngredientOutput, error) {
		// Ingredients must belong to a user that exists
		if _, err := store.GetUser(ctx, in.Phone); err != nil {
			return nil, toHTTPError(err)
		}

		i, err := store.PutIngredient(ctx, Ingredient{User: in.Phone, ID: in.ID, Category: in.Body.Category, Name: in.Body.Name}, in.Body.Version)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &IngredientOutput{Body: i}, nil
	})

	// Delete an ingredient
	huma.Register(api, huma.Operation{
		OperationID: "delete-ingredient", Method: http.MethodDelete, Path: "/users/{phone}/ingredients/{id}", Summary: "Delete an ingredient",
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *IngredientInput) (*struct{}, error) {
		if err := store.DeleteIngredient(ctx, in.Phone, in.ID); err != nil {
			return nil, toHTTPError(err)
		}

		return nil, nil
	})
}
