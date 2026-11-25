# Deploys the API lambda and its Function URL.

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/api/infra/modules/api"
}

# The build output is restored into api/dist by the deploy workflow before apply
inputs = {
  name                   = values.name
  users_table_name       = values.users_table_name
  ingredients_table_name = values.ingredients_table_name
  cors_allowed_origins   = values.cors_allowed_origins
  build_dir              = "${get_repo_root()}/api/dist"
}
