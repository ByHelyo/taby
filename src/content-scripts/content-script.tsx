import App from "../components/App.tsx";
import "./content-script.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "~/index.css";
import { EContext } from "~/type/misc.ts";

const root = document.createElement("div");
root.id = "taby-root";

const body = document.querySelector("body");
if (body) {
  body.append(root);
}

createRoot(root).render(
  <StrictMode>
    <App context={EContext.ContentScript} />
  </StrictMode>,
);
