# Deploys the API lambda, its Function URL and the DynamoDB events table.

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/api/infra/modules/api"
}

# The build output is restored into api/dist by the deploy workflow before apply
inputs = {
  name                 = values.name
  cors_allowed_origins = values.cors_allowed_origins
  build_dir            = "${get_repo_root()}/api/dist"
}
