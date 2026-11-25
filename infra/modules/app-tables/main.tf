# Guests, keyed by the phone number they identify themselves with
resource "aws_dynamodb_table" "users" {
  name         = var.users_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "phone"

  attribute {
    name = "phone"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# Items guests bring, grouped under the owning user so a guest's items can be queried or edited together
resource "aws_dynamodb_table" "ingredients" {
  name         = var.ingredients_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user"
  range_key    = "ingredient_id"

  attribute {
    name = "user"
    type = "S"
  }

  attribute {
    name = "ingredient_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}
