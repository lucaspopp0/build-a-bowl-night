// Vite and React plugin imports used to configure the build.
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Enables the React plugin and outputs the production build to site/dist.
// The base path is set by the deploy workflow, since GitHub project pages are served from /<repo>/.
export default defineConfig(({ mode }) => {
  // Reads VITE_-prefixed variables from the environment (and any .env files).
  const env = loadEnv(mode, ".", "VITE_");

  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [react()],
    build: {
      outDir: "dist",
    },
  };
});
