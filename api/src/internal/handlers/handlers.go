package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/lucaspopp0/build-a-bowl-night/api/internal/db"
)

// OpenAPI tags used to group operations by entity type.
const (
	// TagUsers groups the user operations.
	TagUsers = "Users"
	// TagIngredients groups the ingredient operations.
	TagIngredients = "Ingredients"
)

// UsersOutput is the response body listing users.
type UsersOutput struct {
	Body struct {
		Users []db.User `json:"users"`
	}
}

// UserOutput is the response body for a single user.
type UserOutput struct {
	Body db.User
}

// PhoneInput carries the phone number path parameter.
type PhoneInput struct {
	Phone string `path:"phone" minLength:"1" maxLength:"32" doc:"Phone number of the user"`
}

// PutUserInput is the request of the user upsert operation.
type PutUserInput struct {
	PhoneInput
	Body struct {
		Name string `json:"name" minLength:"1" maxLength:"200" doc:"Display name"`
	}
}

// IngredientsOutput is the response body listing ingredients.
type IngredientsOutput struct {
	Body struct {
		Ingredients []db.Ingredient `json:"ingredients"`
	}
}

// IngredientOutput is the response body for a single ingredient.
type IngredientOutput struct {
	Body db.Ingredient
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
	}
}

// CreateIngredientInput is the request of the ingredient create operation.
type CreateIngredientInput struct {
	PhoneInput
	Body struct {
		Category string `json:"category" minLength:"1" maxLength:"100" doc:"Kind of ingredient, such as protein or topping"`
		Name     string `json:"name" minLength:"1" maxLength:"200" doc:"What is being brought"`
	}
}

// newID returns a random 128-bit hex identifier for a new ingredient.
func newID() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}

	return hex.EncodeToString(b), nil
}

// toHTTPError maps store errors onto the matching HTTP error responses.
func toHTTPError(err error) error {
	switch {
	case errors.Is(err, db.ErrNotFound):
		return huma.Error404NotFound("not found")
	default:
		return huma.Error500InternalServerError("internal error")
	}
}

// Register registers the users and ingredients endpoints, backed by the given store.
func Register(api huma.API, store db.Store) {
	// List all users
	huma.Register(api, huma.Operation{
		OperationID: "list-users", Method: http.MethodGet, Path: "/users", Summary: "List users", Tags: []string{TagUsers},
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
		OperationID: "get-user", Method: http.MethodGet, Path: "/users/{phone}", Summary: "Get a user", Tags: []string{TagUsers},
	}, func(ctx context.Context, in *PhoneInput) (*UserOutput, error) {
		u, err := store.GetUser(ctx, in.Phone)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &UserOutput{Body: u}, nil
	})

	// Create or update a user
	huma.Register(api, huma.Operation{
		OperationID: "put-user", Method: http.MethodPut, Path: "/users/{phone}", Summary: "Create or update a user", Tags: []string{TagUsers},
	}, func(ctx context.Context, in *PutUserInput) (*UserOutput, error) {
		u, err := store.PutUser(ctx, db.User{Phone: in.Phone, Name: in.Body.Name})
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &UserOutput{Body: u}, nil
	})

	// Delete a user together with all of their ingredients
	huma.Register(api, huma.Operation{
		OperationID: "delete-user", Method: http.MethodDelete, Path: "/users/{phone}", Summary: "Delete a user and their ingredients", Tags: []string{TagUsers},
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
			if err := store.DeleteIngredient(ctx, i.User, i.ID); err != nil && !errors.Is(err, db.ErrNotFound) {
				return nil, toHTTPError(err)
			}
		}

		if err := store.DeleteUser(ctx, in.Phone); err != nil && !errors.Is(err, db.ErrNotFound) {
			return nil, toHTTPError(err)
		}

		return nil, nil
	})

	// List every ingredient being brought
	huma.Register(api, huma.Operation{
		OperationID: "list-ingredients", Method: http.MethodGet, Path: "/ingredients", Summary: "List all ingredients", Tags: []string{TagIngredients},
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
		OperationID: "list-user-ingredients", Method: http.MethodGet, Path: "/users/{phone}/ingredients", Summary: "List a user's ingredients", Tags: []string{TagIngredients},
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

	// Create an ingredient with a server-generated id
	huma.Register(api, huma.Operation{
		OperationID: "create-ingredient", Method: http.MethodPost, Path: "/users/{phone}/ingredients", Summary: "Create an ingredient", Tags: []string{TagIngredients},
		DefaultStatus: http.StatusCreated, Errors: []int{http.StatusNotFound},
	}, func(ctx context.Context, in *CreateIngredientInput) (*IngredientOutput, error) {
		// Ingredients must belong to a user that exists
		if _, err := store.GetUser(ctx, in.Phone); err != nil {
			return nil, toHTTPError(err)
		}

		id, err := newID()
		if err != nil {
			return nil, toHTTPError(err)
		}

		i, err := store.PutIngredient(ctx, db.Ingredient{User: in.Phone, ID: id, Category: in.Body.Category, Name: in.Body.Name})
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &IngredientOutput{Body: i}, nil
	})

	// Get one ingredient of a user
	huma.Register(api, huma.Operation{
		OperationID: "get-ingredient", Method: http.MethodGet, Path: "/users/{phone}/ingredients/{id}", Summary: "Get an ingredient", Tags: []string{TagIngredients},
	}, func(ctx context.Context, in *IngredientInput) (*IngredientOutput, error) {
		i, err := store.GetIngredient(ctx, in.Phone, in.ID)
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &IngredientOutput{Body: i}, nil
	})

	// Create or update an ingredient of an existing user
	huma.Register(api, huma.Operation{
		OperationID: "put-ingredient", Method: http.MethodPut, Path: "/users/{phone}/ingredients/{id}", Summary: "Create or update an ingredient", Tags: []string{TagIngredients},
		Errors: []int{http.StatusNotFound},
	}, func(ctx context.Context, in *PutIngredientInput) (*IngredientOutput, error) {
		// Ingredients must belong to a user that exists
		if _, err := store.GetUser(ctx, in.Phone); err != nil {
			return nil, toHTTPError(err)
		}

		i, err := store.PutIngredient(ctx, db.Ingredient{User: in.Phone, ID: in.ID, Category: in.Body.Category, Name: in.Body.Name})
		if err != nil {
			return nil, toHTTPError(err)
		}

		return &IngredientOutput{Body: i}, nil
	})

	// Delete an ingredient
	huma.Register(api, huma.Operation{
		OperationID: "delete-ingredient", Method: http.MethodDelete, Path: "/users/{phone}/ingredients/{id}", Summary: "Delete an ingredient", Tags: []string{TagIngredients},
		DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *IngredientInput) (*struct{}, error) {
		if err := store.DeleteIngredient(ctx, in.Phone, in.ID); err != nil {
			return nil, toHTTPError(err)
		}

		return nil, nil
	})
}
