variable "users_table_name" {
  type        = string
  description = "Name of the DynamoDB users table"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.users_table_name))
    error_message = "users_table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}

variable "ingredients_table_name" {
  type        = string
  description = "Name of the DynamoDB ingredients table"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.ingredients_table_name))
    error_message = "ingredients_table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}
