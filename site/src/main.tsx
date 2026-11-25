// React and DOM imports used to mount the app.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Roboto font weights used by Material UI.
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App";

// Mounts the App component into the #root element defined in index.html.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
