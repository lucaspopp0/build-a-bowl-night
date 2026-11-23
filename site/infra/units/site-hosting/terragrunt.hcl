# Deploys the S3 bucket and CloudFront distribution that host the site.

include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "${get_repo_root()}/site/infra/modules/site-hosting"
}

# Inputs are supplied by the stack that instantiates this unit
inputs = {
  bucket_name = values.bucket_name
}
