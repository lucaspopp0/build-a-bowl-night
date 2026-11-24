# site

The source code for the website

A React + TypeScript frontend built with Vite, for viewing and submitting what guests are bringing to Build-a-Bowl Night.
It is built into `dist/` and deployed to S3, served through CloudFront.

## Development

Requires Node 26.

```sh
npm install
npm run dev      # start the local dev server
npm run build    # type-check and build for production into dist/ (or: make build)
npm run preview  # serve the production build locally
```
