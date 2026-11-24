# Deploys the DynamoDB table that stores the event log.

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
