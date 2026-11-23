variable "bucket_name" {
  type        = string
  description = "Name of the private S3 bucket that holds the built site"

  # S3 bucket names are 3-63 characters of lowercase letters, digits, dots and hyphens,
  # and must start and end with a letter or digit
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$", var.bucket_name))
    error_message = "bucket_name must be a valid S3 bucket name (3-63 chars, lowercase letters, digits, dots, hyphens)."
  }
}

variable "price_class" {
  type        = string
  description = "CloudFront price class"
  default     = "PriceClass_100"

  # Restricted to the three price classes CloudFront accepts
  validation {
    condition     = contains(["PriceClass_100", "PriceClass_200", "PriceClass_All"], var.price_class)
    error_message = "price_class must be PriceClass_100, PriceClass_200 or PriceClass_All."
  }
}
