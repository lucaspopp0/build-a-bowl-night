package main

import (
	"context"
	"sort"
	"sync"
)

// memStore is an in-memory Store used by tests, mirroring the DynamoDB store's versioning rules.
type memStore struct {
	mu          sync.Mutex
	users       map[string]User
	ingredients map[[2]string]Ingredient
}

// newMemStore creates an empty in-memory store.
func newMemStore() *memStore {
	return &memStore{users: map[string]User{}, ingredients: map[[2]string]Ingredient{}}
}

// check applies the optimistic-concurrency rule for a put against the stored version.
func check(exists bool, stored int, expected *int) error {
	if expected == nil {
		return nil
	}

	if (*expected == 0 && exists) || (*expected != 0 && (!exists || stored != *expected)) {
		return ErrConflict
	}

	return nil
}

// ListUsers returns all users sorted by phone.
func (m *memStore) ListUsers(context.Context) ([]User, error) {
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
func (m *memStore) GetUser(_ context.Context, phone string) (User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	u, ok := m.users[phone]
	if !ok {
		return User{}, ErrNotFound
	}

	return u, nil
}

// PutUser upserts a user, bumping its version.
func (m *memStore) PutUser(_ context.Context, u User, expected *int) (User, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	old, ok := m.users[u.Phone]
	if err := check(ok, old.Version, expected); err != nil {
		return User{}, err
	}

	u.Version = old.Version + 1
	m.users[u.Phone] = u

	return u, nil
}

// DeleteUser removes a user or returns ErrNotFound.
func (m *memStore) DeleteUser(_ context.Context, phone string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.users[phone]; !ok {
		return ErrNotFound
	}

	delete(m.users, phone)

	return nil
}

// ListIngredients returns one user's ingredients, or all when user is empty, sorted by user and id.
func (m *memStore) ListIngredients(_ context.Context, user string) ([]Ingredient, error) {
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
func (m *memStore) GetIngredient(_ context.Context, user, id string) (Ingredient, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	i, ok := m.ingredients[[2]string{user, id}]
	if !ok {
		return Ingredient{}, ErrNotFound
	}

	return i, nil
}

// PutIngredient upserts an ingredient, bumping its version.
func (m *memStore) PutIngredient(_ context.Context, i Ingredient, expected *int) (Ingredient, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	old, ok := m.ingredients[[2]string{i.User, i.ID}]
	if err := check(ok, old.Version, expected); err != nil {
		return Ingredient{}, err
	}

	i.Version = old.Version + 1
	m.ingredients[[2]string{i.User, i.ID}] = i

	return i, nil
}

// DeleteIngredient removes an ingredient or returns ErrNotFound.
func (m *memStore) DeleteIngredient(_ context.Context, user, id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.ingredients[[2]string{user, id}]; !ok {
		return ErrNotFound
	}

	delete(m.ingredients, [2]string{user, id})

	return nil
}
