import "../index.css";
import "./popup.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App";
import { EContext } from "~/type/misc";

createRoot(document.getElementById("taby-root")!).render(
  <StrictMode>
    <App context={EContext.Popup} />
  </StrictMode>,
);
