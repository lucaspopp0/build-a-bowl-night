// Vite and React plugin imports used to configure the build.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Enables the React plugin, bundles the API SDK straight from its source, and outputs the production build to site/dist.
// The site is served from the root of a CloudFront distribution, so no base path is needed.
export default defineConfig({
  plugins: [react()],
  // Resolves the SDK from source so the site build does not depend on the SDK being built first.
  resolve: {
    alias: {
      "@build-a-bowl-night/api-sdk": new URL("../api-sdk/src/index.ts", import.meta.url).pathname,
    },
  },
  build: {
    outDir: "dist",
  },
});
