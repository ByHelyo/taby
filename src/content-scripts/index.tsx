import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const index = document.createElement("div");
index.id = "extension-root";

const body = document.querySelector("body");
if (body) {
  body.appendChild(index);
}

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import "./index.css";
