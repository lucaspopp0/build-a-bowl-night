# The prd stack for the site: the S3 bucket and CloudFront distribution that host it.

unit "site_hosting" {
  source = "${get_repo_root()}/site/infra/units/site-hosting"
  path   = "site-hosting"

  values = {
    bucket_name = "build-a-bowl-night-site-prd"
  }
}
