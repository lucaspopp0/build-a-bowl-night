// React and DOM imports used to mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Mounts the App component into the #root element defined in index.html.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
