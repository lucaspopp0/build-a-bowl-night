# Overview

This project is a website for an event I'm hosting called "Build-a-Bowl Night".

The premise of the event is that we are making our own rice bowls, and each guest brings one or more ingredients that could be put into a rice bowl.

The website will have two main purposes:
1. View what others are bringing
2. Submit what you are bringing

## Architecture

The repository is a slingshot-pipelines project (see `.components/`), deployed to AWS from GitHub Actions.

| Component | Type | Path | What it is |
|---|---|---|---|
| `site` | `s3-website` | `site/` | React + Vite frontend (`subpaths`: src `.`, build `dist`, infra `infra`), served from S3 through CloudFront |
| `api` | `lambda` | `api/` | Go Lambda behind a Function URL |
| `infra` | `terragrunt-infra` | `infra/` | Shared infrastructure: the DynamoDB users and ingredients tables |

There is a single environment, `prd`.
Merging to `main` starts a deployment sequence for each changed component.
Pull requests check only the changed components, and the `pr-ready` job is the required status check.

Infrastructure is written as Terragrunt `units/` and `stacks/` plus Terraform `modules/`.
`site/infra/` contains the site hosting (S3 bucket and CloudFront distribution), applied by the site's own deployment.
`api/infra/` contains only the Lambda (function, role, log group and Function URL).
Everything else lives in the `infra` component, including the DynamoDB table.
The Lambda finds the tables by name (`users_table_name` and `ingredients_table_name`), so the two stacks must agree on them.
Each stack directory has a `stack.yml` with the AWS account, deploy role and Terraform state bucket.

## UI Requirements

1. The user identifies themself by phone number - new users should be keyed by phone number and have a name stored
2. The user can view the full list of items bring brought
3. The user can edit or remove any item associated with them
4. The user can submit a new item they plan to bring

## Backend Requirements

1. Two concurrent edits to data by different users will not overwrite each other
2. The site reads and writes events through the API Lambda's Function URL, configured at build time as `VITE_API_URL`
3. Entities
   1. Users (fields: phone, name)
   2. Ingredients (fields: user, category, name)
4. Backend should be a REST api

## Code Style

Every function should have a one-to-two-line comment above it, explaining what it does.

Each block of code should have a one-to-two line comment above it, explaining what it does.
