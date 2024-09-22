import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../components/App.tsx";
import "./content-script.css";
import "../index.css";
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
