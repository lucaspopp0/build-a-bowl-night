variable "users_table_name" {
  type        = string
  description = "Name of the DynamoDB users table"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.users_table_name))
    error_message = "users_table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}

variable "components_table_name" {
  type        = string
  description = "Name of the DynamoDB components table"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.components_table_name))
    error_message = "components_table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}
