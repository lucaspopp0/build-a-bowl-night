# Site

The frontend for Build-a-Bowl Night, built with Vite and deployed to S3 and CloudFront by slingshot-pipelines (the `site` component).
See the root [AGENTS.md](../AGENTS.md) for the overall project requirements and code style.

## Source layout

- `src/main.tsx`: JS entry point, referenced by `index.html`. Mounts the app.
- `src/App.tsx`: Root component. Wires together top-level layout and page selection.
- `src/components/`: Reusable UI building blocks (e.g. an item card, a form field, a phone number input).
  Components should be presentational and receive data via props, with no direct storage access.
- `src/pages/`: Top-level screens, each composed from components (e.g. the list of items being brought,
  the form to submit or edit an item, the sign-in by phone number). Pages own data loading and state.
- `src/lib/`: Non-UI logic with no React dependency (e.g. the API client, event log reading/writing,
  reducing events into current state, phone number normalization). Keep this easy to unit test.

Empty directories are tracked with `.gitkeep` files. Remove the `.gitkeep` once a directory has real contents.

The API base URL comes from `VITE_API_URL`, set per environment in `deployments/<env>/deployment.yml`.

The `.components/site/info.yml` `subpaths` are `src: .` (this directory), `build: dist` and `infra: infra`.
`infra/` holds the Terragrunt units, stacks and Terraform modules for the S3 bucket and CloudFront distribution,
and the slingshot deploy applies `infra/stacks/<env>` before uploading `dist/`.
