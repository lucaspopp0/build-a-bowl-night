variable "name" {
  type        = string
  description = "Base name for the Lambda function and its role"

  # Lowercase letters, digits and hyphens only, so the name is valid for Lambda, IAM and DynamoDB alike
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,47}$", var.name))
    error_message = "name must be 2-48 characters: lowercase letters, digits and hyphens, starting with a letter."
  }
}

variable "events_table_name" {
  type        = string
  description = "Name of the DynamoDB events table, which is created by the infra component"

  # DynamoDB table names are 3-255 characters of letters, digits, underscores, hyphens and dots
  validation {
    condition     = can(regex("^[a-zA-Z0-9_.-]{3,255}$", var.events_table_name))
    error_message = "events_table_name must be 3-255 characters: letters, digits, underscores, hyphens and dots."
  }
}

variable "build_dir" {
  type        = string
  description = "Directory containing the compiled bootstrap executable"
}

variable "cors_allowed_origins" {
  type        = list(string)
  description = "Origins allowed to call the Function URL from a browser"
  default     = ["*"]

  # An empty list would silently block every browser request, so require at least one origin
  validation {
    condition     = length(var.cors_allowed_origins) > 0
    error_message = "cors_allowed_origins must contain at least one origin."
  }

  # Each entry must be "*" or a full https origin without a path, such as https://example.cloudfront.net
  validation {
    condition     = alltrue([for o in var.cors_allowed_origins : o == "*" || can(regex("^https?://[^/]+$", o))])
    error_message = "Each cors_allowed_origins entry must be \"*\" or an origin like https://example.com (no trailing slash or path)."
  }
}

variable "log_retention_days" {
  type        = number
  description = "Days to keep Lambda logs"
  default     = 14

  # CloudWatch only accepts specific retention values; these are the ones relevant for a small site
  validation {
    condition     = contains([1, 3, 5, 7, 14, 30, 60, 90], var.log_retention_days)
    error_message = "log_retention_days must be one of 1, 3, 5, 7, 14, 30, 60, 90."
  }
}
