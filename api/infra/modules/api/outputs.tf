output "function_url" {
  description = "Base URL of the API, used as VITE_API_URL by the site"
  value       = aws_lambda_function_url.api.function_url
}

output "events_table_name" {
  description = "Name of the DynamoDB events table"
  value       = aws_dynamodb_table.events.name
}
