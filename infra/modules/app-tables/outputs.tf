output "users_table_name" {
  description = "Name of the users table"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN of the users table"
  value       = aws_dynamodb_table.users.arn
}

output "ingredients_table_name" {
  description = "Name of the ingredients table"
  value       = aws_dynamodb_table.ingredients.name
}

output "ingredients_table_arn" {
  description = "ARN of the ingredients table"
  value       = aws_dynamodb_table.ingredients.arn
}
