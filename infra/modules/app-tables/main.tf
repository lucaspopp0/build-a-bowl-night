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
resource "aws_dynamodb_table" "components" {
  name         = var.components_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user"
  range_key    = "component_id"

  attribute {
    name = "user"
    type = "S"
  }

  attribute {
    name = "component_id"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}
