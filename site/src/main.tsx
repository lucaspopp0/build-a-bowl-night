// React and DOM imports used to mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Commissioner font weights used by the theme.
import "@fontsource/commissioner/400.css";
import "@fontsource/commissioner/500.css";
import "@fontsource/commissioner/700.css";
// Pacifico, used for the navbar and category titles.
import "@fontsource/pacifico/400.css";
import App from "./App";

// Mounts the App component into the #root element defined in index.html.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
