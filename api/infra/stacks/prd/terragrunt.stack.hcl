# The prd stack for the API.

unit "api" {
  source = "${get_repo_root()}/api/infra/units/api"
  path   = "api"

  values = {
    name = "build-a-bowl-night-api-prd"

    # Tighten to the CloudFront site URL once the site hosting infra has been deployed
    cors_allowed_origins = ["*"]
  }
}
