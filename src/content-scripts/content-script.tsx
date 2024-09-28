import App from "../components/App.tsx";
import "../index.css";
import "./content-script.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EContext } from "~/type/misc.ts";

const root = document.createElement("div");
root.id = "taby-root";

const body = document.querySelector("body");
if (body) {
  body.prepend(root);
}

createRoot(root).render(
  <StrictMode>
    <App context={EContext.ContentScript} />
  </StrictMode>,
);
