# Deploys the DynamoDB tables that store users and the components they bring.

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/infra/modules/app-tables"
}

# Inputs are supplied by the stack that instantiates this unit
inputs = {
  users_table_name      = values.users_table_name
  components_table_name = values.components_table_name
}
