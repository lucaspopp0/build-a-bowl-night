package db

import (
	"context"
	"errors"
)

// ErrNotFound is returned by a Store when the requested item does not exist.
var ErrNotFound = errors.New("not found")

// ErrConflict is returned by a Store when an item was changed by someone else since the caller read it.
var ErrConflict = errors.New("version conflict")

// User is a guest, keyed by the phone number they identify themselves with.
type User struct {
	Phone   string `json:"phone" doc:"Phone number the guest identifies themselves with"`
	Name    string `json:"name" doc:"Display name"`
	Version int    `json:"version" doc:"Incremented on every write, for optimistic concurrency"`
}

// Ingredient is an item a guest plans to bring, owned by a user.
type Ingredient struct {
	User     string `json:"user" doc:"Phone number of the owning user"`
	ID       string `json:"id" dynamodbav:"ingredient_id" doc:"Identifier of the ingredient, unique within its user"`
	Category string `json:"category" doc:"Kind of ingredient, such as protein or topping"`
	Name     string `json:"name" doc:"What is being brought"`
	Version  int    `json:"version" doc:"Incremented on every write, for optimistic concurrency"`
}

// Store persists users and ingredients.
// A non-nil expectedVersion on a put makes it conditional: 0 means the item must not exist yet, anything else must match the stored version.
type Store interface {
	ListUsers(ctx context.Context) ([]User, error)
	GetUser(ctx context.Context, phone string) (User, error)
	PutUser(ctx context.Context, u User, expectedVersion *int) (User, error)
	DeleteUser(ctx context.Context, phone string) error

	ListIngredients(ctx context.Context, user string) ([]Ingredient, error)
	GetIngredient(ctx context.Context, user, id string) (Ingredient, error)
	PutIngredient(ctx context.Context, i Ingredient, expectedVersion *int) (Ingredient, error)
	DeleteIngredient(ctx context.Context, user, id string) error
}
