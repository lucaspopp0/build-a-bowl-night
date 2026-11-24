# Shared Terragrunt config included by every unit in the site component: remote state and AWS provider.

locals {
  # Account and state bucket details come from the stack.yml of whichever stack generated the unit
  stack_info = yamldecode(file(find_in_parent_folders("stack.yml")))
}

# Stores state in the S3 bucket named by stack.yml, with native S3 locking
remote_state {
  backend = "s3"

  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }

  config = {
    bucket       = local.stack_info["states-bucket"]
    key          = "build-a-bowl-night/site/${path_relative_to_include()}/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}

# Configures the AWS provider, restricted to the account the stack targets
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"

  contents = <<-EOT
    provider "aws" {
      region              = "us-east-1"
      allowed_account_ids = ["${local.stack_info["aws-account-id"]}"]
    }
  EOT
}
