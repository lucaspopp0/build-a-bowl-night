package main

import (
	"context"
	"errors"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// DynamoStore is a Store backed by the users and ingredients DynamoDB tables.
type DynamoStore struct {
	db              *dynamodb.Client
	usersTable      string
	ingredientTable string
}

// NewDynamoStore creates a Store that reads and writes the named tables.
func NewDynamoStore(db *dynamodb.Client, usersTable, ingredientsTable string) *DynamoStore {
	return &DynamoStore{db: db, usersTable: usersTable, ingredientTable: ingredientsTable}
}

// key builds a DynamoDB key from alternating attribute names and string values.
func key(pairs ...string) map[string]types.AttributeValue {
	k := map[string]types.AttributeValue{}
	for i := 0; i+1 < len(pairs); i += 2 {
		k[pairs[i]] = &types.AttributeValueMemberS{Value: pairs[i+1]}
	}

	return k
}

// condition builds the condition expression and values enforcing an expected version on a put.
// Version 0 requires that the item does not exist; a nil version applies no condition.
func condition(expected *int, keyAttr string, values map[string]types.AttributeValue) *string {
	if expected == nil {
		return nil
	}

	// A brand-new item has no version attribute, so 0 means "must not exist"
	if *expected == 0 {
		return aws.String("attribute_not_exists(" + keyAttr + ")")
	}

	values[":expected"] = &types.AttributeValueMemberN{Value: strconv.Itoa(*expected)}

	return aws.String("version = :expected")
}

// put upserts an item by setting the given fields and atomically bumping its version, returning the stored item.
// Only the listed fields are touched, so concurrent writers of other fields are not overwritten.
func (s *DynamoStore) put(ctx context.Context, table string, k map[string]types.AttributeValue, keyAttr string, fields map[string]string, expected *int, out any) error {
	// Build "SET #f = :f, ... ADD version :one" for the supplied fields
	names := map[string]string{}
	values := map[string]types.AttributeValue{":one": &types.AttributeValueMemberN{Value: "1"}}
	set := ""
	for f, v := range fields {
		if set != "" {
			set += ", "
		}
		set += "#" + f + " = :" + f
		names["#"+f] = f
		values[":"+f] = &types.AttributeValueMemberS{Value: v}
	}

	cond := condition(expected, keyAttr, values)

	res, err := s.db.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName:                 aws.String(table),
		Key:                       k,
		UpdateExpression:          aws.String("SET " + set + " ADD version :one"),
		ConditionExpression:       cond,
		ExpressionAttributeNames:  names,
		ExpressionAttributeValues: values,
		ReturnValues:              types.ReturnValueAllNew,
	})
	if err != nil {
		var ccf *types.ConditionalCheckFailedException
		if errors.As(err, &ccf) {
			return ErrConflict
		}

		return err
	}

	return attributevalue.UnmarshalMap(res.Attributes, out)
}

// get reads a single item by key into out.
func (s *DynamoStore) get(ctx context.Context, table string, k map[string]types.AttributeValue, out any) error {
	res, err := s.db.GetItem(ctx, &dynamodb.GetItemInput{TableName: aws.String(table), Key: k, ConsistentRead: aws.Bool(true)})
	if err != nil {
		return err
	}

	if res.Item == nil {
		return ErrNotFound
	}

	return attributevalue.UnmarshalMap(res.Item, out)
}

// del removes an item by key, reporting ErrNotFound when it did not exist.
func (s *DynamoStore) del(ctx context.Context, table string, k map[string]types.AttributeValue) error {
	res, err := s.db.DeleteItem(ctx, &dynamodb.DeleteItemInput{TableName: aws.String(table), Key: k, ReturnValues: types.ReturnValueAllOld})
	if err != nil {
		return err
	}

	if len(res.Attributes) == 0 {
		return ErrNotFound
	}

	return nil
}

// ListUsers returns every user.
func (s *DynamoStore) ListUsers(ctx context.Context) ([]User, error) {
	users := []User{}

	// Scan page by page until DynamoDB reports no more results
	p := dynamodb.NewScanPaginator(s.db, &dynamodb.ScanInput{TableName: aws.String(s.usersTable), ConsistentRead: aws.Bool(true)})
	for p.HasMorePages() {
		page, err := p.NextPage(ctx)
		if err != nil {
			return nil, err
		}

		var batch []User
		if err := attributevalue.UnmarshalListOfMaps(page.Items, &batch); err != nil {
			return nil, err
		}

		users = append(users, batch...)
	}

	return users, nil
}

// GetUser returns the user with the given phone number.
func (s *DynamoStore) GetUser(ctx context.Context, phone string) (User, error) {
	var u User
	err := s.get(ctx, s.usersTable, key("phone", phone), &u)

	return u, err
}

// PutUser creates or updates a user's name.
func (s *DynamoStore) PutUser(ctx context.Context, u User, expected *int) (User, error) {
	var out User
	err := s.put(ctx, s.usersTable, key("phone", u.Phone), "phone", map[string]string{"name": u.Name}, expected, &out)

	return out, err
}

// DeleteUser removes a user.
func (s *DynamoStore) DeleteUser(ctx context.Context, phone string) error {
	return s.del(ctx, s.usersTable, key("phone", phone))
}

// ListIngredients returns one user's ingredients, or every ingredient when user is empty.
func (s *DynamoStore) ListIngredients(ctx context.Context, user string) ([]Ingredient, error) {
	items := []Ingredient{}

	// Collect each page of results from either a query (one user) or a scan (everyone)
	collect := func(raw []map[string]types.AttributeValue) error {
		var batch []Ingredient
		if err := attributevalue.UnmarshalListOfMaps(raw, &batch); err != nil {
			return err
		}

		items = append(items, batch...)

		return nil
	}

	if user == "" {
		p := dynamodb.NewScanPaginator(s.db, &dynamodb.ScanInput{TableName: aws.String(s.ingredientTable), ConsistentRead: aws.Bool(true)})
		for p.HasMorePages() {
			page, err := p.NextPage(ctx)
			if err != nil {
				return nil, err
			}

			if err := collect(page.Items); err != nil {
				return nil, err
			}
		}

		return items, nil
	}

	p := dynamodb.NewQueryPaginator(s.db, &dynamodb.QueryInput{
		TableName:                 aws.String(s.ingredientTable),
		KeyConditionExpression:    aws.String("#u = :u"),
		ExpressionAttributeNames:  map[string]string{"#u": "user"},
		ExpressionAttributeValues: map[string]types.AttributeValue{":u": &types.AttributeValueMemberS{Value: user}},
		ConsistentRead:            aws.Bool(true),
	})
	for p.HasMorePages() {
		page, err := p.NextPage(ctx)
		if err != nil {
			return nil, err
		}

		if err := collect(page.Items); err != nil {
			return nil, err
		}
	}

	return items, nil
}

// GetIngredient returns one ingredient of a user.
func (s *DynamoStore) GetIngredient(ctx context.Context, user, id string) (Ingredient, error) {
	var i Ingredient
	err := s.get(ctx, s.ingredientTable, key("user", user, "ingredient_id", id), &i)

	return i, err
}

// PutIngredient creates or updates an ingredient's category and name.
func (s *DynamoStore) PutIngredient(ctx context.Context, i Ingredient, expected *int) (Ingredient, error) {
	var out Ingredient
	err := s.put(ctx, s.ingredientTable, key("user", i.User, "ingredient_id", i.ID), "ingredient_id", map[string]string{"category": i.Category, "name": i.Name}, expected, &out)

	return out, err
}

// DeleteIngredient removes one ingredient of a user.
func (s *DynamoStore) DeleteIngredient(ctx context.Context, user, id string) error {
	return s.del(ctx, s.ingredientTable, key("user", user, "ingredient_id", id))
}
