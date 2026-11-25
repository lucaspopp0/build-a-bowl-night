# The prd stack for the API.

unit "api" {
  source = "${get_repo_root()}/api/infra/units/api"
  path   = "api"

  values = {
    name = "build-a-bowl-night-api-prd"

    # Must match the tables created by the app_tables unit in the infra component's prd stack
    users_table_name       = "build-a-bowl-night-users-prd"
    ingredients_table_name = "build-a-bowl-night-ingredients-prd"

    # Tighten to the CloudFront site URL once the site hosting infra has been deployed
    cors_allowed_origins = ["*"]
  }
}
