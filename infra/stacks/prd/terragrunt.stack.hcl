# The prd stack for shared infrastructure that does not belong to a single component.

unit "app_tables" {
  source = "${get_repo_root()}/infra/units/app-tables"
  path   = "app-tables"

  values = {
    # The api component's prd stack refers to these tables by name, so keep the two in sync
    users_table_name       = "build-a-bowl-night-users-prd"
    ingredients_table_name = "build-a-bowl-night-ingredients-prd"
  }
}
