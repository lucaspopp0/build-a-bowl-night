output "users_table_name" {
  description = "Name of the users table"
  value       = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  description = "ARN of the users table"
  value       = aws_dynamodb_table.users.arn
}

output "components_table_name" {
  description = "Name of the components table"
  value       = aws_dynamodb_table.components.name
}

output "components_table_arn" {
  description = "ARN of the components table"
  value       = aws_dynamodb_table.components.arn
}
