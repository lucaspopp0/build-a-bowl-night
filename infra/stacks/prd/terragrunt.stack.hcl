# The prd stack: every unit that makes up the production infrastructure.

unit "site_hosting" {
  source = "${get_repo_root()}/infra/units/site-hosting"
  path   = "site-hosting"

  values = {
    bucket_name = "build-a-bowl-night-site-prd"
  }
}

unit "events_table" {
  source = "${get_repo_root()}/infra/units/events-table"
  path   = "events-table"

  values = {
    # The api component's prd stack refers to this table by name, so keep the two in sync
    table_name = "build-a-bowl-night-events-prd"
  }
}
