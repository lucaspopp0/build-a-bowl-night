# build-a-bowl-night

A website for Build-a-Bowl Night, an event where everyone brings a component for a rice bowl.
Guests can see what others are bringing and submit their own items.

**Live site:** https://d1h3bq1xtdz6d1.cloudfront.net

## Layout

| Path | Component | Description |
|---|---|---|
| `site/` | `site` | React + Vite frontend; `site/infra` holds its hosting (S3 + CloudFront) |
| `api/` | `api` | Go Lambda API (`api/src`); `api/infra` holds only the Lambda |
| `infra/` | `infra` | Shared infrastructure: the DynamoDB events table |
| `.components/` | | slingshot-pipelines component definitions |

Deployments are driven by [slingshot-pipelines](https://slingshot-pipelines.github.io/docs/).
See [AGENTS.md](AGENTS.md) for the architecture and requirements.

## Local checks

```sh
(cd api/src && make lint unit-test build)   # Go lint, tests, and the lambda executable
(cd site && npm ci && npm run build)        # type-check and build the site
terraform fmt -recursive infra api/infra site/infra    # format Terraform
(cd infra/stacks && terragrunt hcl validate --all --inputs --strict --tf-path terraform)
(cd api/infra/stacks && terragrunt hcl validate --all --inputs --strict --tf-path terraform)
(cd site/infra/stacks && terragrunt hcl validate --all --inputs --strict --tf-path terraform)
```

## One-time setup before the first deployment

These cannot be done from the repository and are needed before the pipeline can deploy:

1. A GitHub App for writing tags and releases, stored as secrets `WRITER_APP_CLIENT_ID` and `WRITER_APP_PRIVATE_KEY`.
2. In AWS: an S3 bucket for Terraform state, and IAM roles that GitHub Actions can assume through OIDC.
3. The `stack.yml` files (`infra/`, `api/infra/` and `site/infra/` under `stacks/prd/`) hold the AWS account ID,
   the deploy role ARN and the Terraform state bucket. `site/deployments/prd/deployment.yml` uses the same role for uploads.
   The role must trust GitHub's OIDC provider for this repository.
4. Deploy `infra` and `api`, then the site. The first site deployment creates the bucket and CloudFront distribution,
   and then stops at the upload step because `cf-distribution` in `site/deployments/prd/deployment.yml` is still a placeholder.
   Copy the CloudFront distribution ID from the `site/infra` outputs, and the API `function_url`
   (as `VITE_API_URL`), into that file, then re-run the site deployment manually (the `deploy (s3-website)` workflow).
5. Add a branch protection rule on `main` that requires the `pr-ready` check.

The workflows install the latest Terraform and Terragrunt on every run (`latest` in `pr.yml` and the `deploy-*.yml` files), so there are no version variables to set.
