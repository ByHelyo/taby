import "../index.css";
import "./popup.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App";

createRoot(document.getElementById("taby-root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
