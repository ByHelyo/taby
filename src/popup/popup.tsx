import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import "../index.css";
import { EContext } from "~/type/misc";
import App from "~/components/App";

createRoot(document.getElementById("taby-root")!).render(
  <StrictMode>
    <App context={EContext.Popup} />
  </StrictMode>,
);
