# The prd stack for shared infrastructure that does not belong to a single component.

unit "events_table" {
  source = "${get_repo_root()}/infra/units/events-table"
  path   = "events-table"

  values = {
    # The api component's prd stack refers to this table by name, so keep the two in sync
    table_name = "build-a-bowl-night-events-prd"
  }
}
