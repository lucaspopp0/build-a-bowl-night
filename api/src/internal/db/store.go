package db

import (
	"context"
	"errors"
)

// ErrNotFound is returned by a Store when the requested item does not exist.
var ErrNotFound = errors.New("not found")

// User is a guest, keyed by the phone number they identify themselves with.
type User struct {
	Phone string `json:"phone" doc:"Phone number the guest identifies themselves with"`
	Name  string `json:"name" doc:"Display name"`
}

// DietaryAttributes flags which dietary restrictions an ingredient is suitable for.
type DietaryAttributes struct {
	GlutenFree bool `json:"glutenFree" dynamodbav:"glutenFree" doc:"Contains no gluten"`
	Vegetarian bool `json:"vegetarian" dynamodbav:"vegetarian" doc:"Contains no meat or fish"`
	Vegan      bool `json:"vegan" dynamodbav:"vegan" doc:"Contains no animal products"`
}

// Ingredient is an item a guest plans to bring, owned by a user.
type Ingredient struct {
	User     string `json:"user" doc:"Phone number of the owning user"`
	ID       string `json:"id" dynamodbav:"ingredient_id" doc:"Identifier of the ingredient, unique within its user"`
	Category string `json:"category" doc:"Kind of ingredient, such as protein or topping"`
	Name     string `json:"name" doc:"What is being brought"`

	DietaryAttributes DietaryAttributes `json:"dietaryAttributes" dynamodbav:"dietaryAttributes" doc:"Dietary restrictions the ingredient is suitable for"`
}

// Store persists users and ingredients.
type Store interface {
	ListUsers(ctx context.Context) ([]User, error)
	GetUser(ctx context.Context, phone string) (User, error)
	PutUser(ctx context.Context, u User) (User, error)
	DeleteUser(ctx context.Context, phone string) error

	ListIngredients(ctx context.Context, user string) ([]Ingredient, error)
	GetIngredient(ctx context.Context, user, id string) (Ingredient, error)
	PutIngredient(ctx context.Context, i Ingredient) (Ingredient, error)
	DeleteIngredient(ctx context.Context, user, id string) error
}
