variable "table_name" {
  type        = string
  description = "Name of the DynamoDB events table"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.table_name))
    error_message = "table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}
