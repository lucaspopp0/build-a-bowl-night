// React and DOM imports used to mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Google Sans font weights used by the app.
import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
// Radix Themes base styles, then the app's own overrides.
import "@radix-ui/themes/styles.css";
import "./index.css";
import App from "./App";

// Mounts the App component into the #root element defined in index.html.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
