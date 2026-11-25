package db

import (
	"context"
	"sort"
	"sync"
)

// MemStore is an in-memory Store for tests, mirroring the DynamoDB store's behavior.
type MemStore struct {
	mu          sync.Mutex
	users       map[string]User
	ingredients map[[2]string]Ingredient
}

// NewMemStore creates an empty in-memory store.
func NewMemStore() *MemStore {
	return &MemStore{users: map[string]User{}, ingredients: map[[2]string]Ingredient{}}
}

// ListUsers returns all users sorted by phone.
func (m *MemStore) ListUsers(context.Context) ([]User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	out := []User{}
	for _, u := range m.users {
		out = append(out, u)
	}

	sort.Slice(out, func(a, b int) bool { return out[a].Phone < out[b].Phone })

	return out, nil
}

// GetUser returns a user or ErrNotFound.
func (m *MemStore) GetUser(_ context.Context, phone string) (User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	u, ok := m.users[phone]
	if !ok {
		return User{}, ErrNotFound
	}

	return u, nil
}

// PutUser upserts a user.
func (m *MemStore) PutUser(_ context.Context, u User) (User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.users[u.Phone] = u

	return u, nil
}

// DeleteUser removes a user or returns ErrNotFound.
func (m *MemStore) DeleteUser(_ context.Context, phone string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.users[phone]; !ok {
		return ErrNotFound
	}

	delete(m.users, phone)

	return nil
}

// ListIngredients returns one user's ingredients, or all when user is empty, sorted by user and id.
func (m *MemStore) ListIngredients(_ context.Context, user string) ([]Ingredient, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	out := []Ingredient{}
	for _, i := range m.ingredients {
		if user == "" || i.User == user {
			out = append(out, i)
		}
	}

	sort.Slice(out, func(a, b int) bool { return out[a].User+out[a].ID < out[b].User+out[b].ID })

	return out, nil
}

// GetIngredient returns an ingredient or ErrNotFound.
func (m *MemStore) GetIngredient(_ context.Context, user, id string) (Ingredient, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	i, ok := m.ingredients[[2]string{user, id}]
	if !ok {
		return Ingredient{}, ErrNotFound
	}

	return i, nil
}

// PutIngredient upserts an ingredient.
func (m *MemStore) PutIngredient(_ context.Context, i Ingredient) (Ingredient, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.ingredients[[2]string{i.User, i.ID}] = i

	return i, nil
}

// DeleteIngredient removes an ingredient or returns ErrNotFound.
func (m *MemStore) DeleteIngredient(_ context.Context, user, id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.ingredients[[2]string{user, id}]; !ok {
		return ErrNotFound
	}

	delete(m.ingredients, [2]string{user, id})

	return nil
}
