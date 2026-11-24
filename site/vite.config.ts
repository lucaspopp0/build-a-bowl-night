// Vite and React plugin imports used to configure the build.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Enables the React plugin and outputs the production build to site/dist.
// The site is served from the root of a CloudFront distribution, so no base path is needed.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
