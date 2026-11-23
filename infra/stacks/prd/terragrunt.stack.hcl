# The prd stack: every unit that makes up the production infrastructure.

unit "site_hosting" {
  source = "${get_repo_root()}/infra/units/site-hosting"
  path   = "site-hosting"

  values = {
    bucket_name = "build-a-bowl-night-site-prd"
  }
}
