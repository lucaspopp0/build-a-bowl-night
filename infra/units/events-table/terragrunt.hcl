# Destroys the retired DynamoDB events table (the module only holds a removed block); the unit itself is deleted in a follow-up change.

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/infra/modules/events-table"
}

# Inputs are supplied by the stack that instantiates this unit
inputs = {
  table_name = values.table_name
}
