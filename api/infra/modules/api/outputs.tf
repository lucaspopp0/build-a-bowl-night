output "function_url" {
  description = "Base URL of the API, used as VITE_API_URL by the site"
  value       = aws_lambda_function_url.api.function_url
}
