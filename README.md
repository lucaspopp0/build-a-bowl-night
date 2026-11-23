# build-a-bowl-night

A website for Build-a-Bowl Night, an event where everyone brings a component for a rice bowl.
Guests can see what others are bringing and submit their own items.

## Layout

| Path | Component | Description |
|---|---|---|
| `site/` | `site` | React + Vite frontend |
| `api/` | `api` | Go Lambda API (`api/src`); `api/infra` holds only the Lambda |
| `infra/` | `infra` | All other infrastructure: site hosting (S3 + CloudFront) and the DynamoDB events table |
| `.components/` | | slingshot-pipelines component definitions |

Deployments are driven by [slingshot-pipelines](https://slingshot-pipelines.github.io/docs/).
See [AGENTS.md](AGENTS.md) for the architecture and requirements.

## Local checks

```sh
(cd api/src && make lint unit-test build)   # Go lint, tests, and the lambda executable
(cd site && npm ci && npm run build)        # type-check and build the site
terraform fmt -recursive infra api/infra    # format Terraform
(cd infra/stacks && terragrunt hcl validate --all --inputs --strict --tf-path terraform)
(cd api/infra/stacks && terragrunt hcl validate --all --inputs --strict --tf-path terraform)
```

## One-time setup before the first deployment

These cannot be done from the repository and are needed before the pipeline can deploy:

1. Repository variables `TERRAFORM_VERSION` and `TERRAGRUNT_VERSION`.
2. A GitHub App for writing tags and releases, stored as secrets `WRITER_APP_CLIENT_ID` and `WRITER_APP_PRIVATE_KEY`.
3. In AWS: an S3 bucket for Terraform state, and IAM roles that GitHub Actions can assume through OIDC.
4. Replace the `REPLACE-ME` and `000000000000` placeholders in:
   - `infra/stacks/prd/stack.yml`
   - `api/infra/stacks/prd/stack.yml`
   - `site/deployments/prd/deployment.yml`
5. Deploy `infra` and `api` first, then copy the outputs into `site/deployments/prd/deployment.yml`:
   the bucket name, the CloudFront distribution ID, and the API `function_url` (as `VITE_API_URL`).
6. Add a branch protection rule on `main` that requires the `pr-ready` check.
