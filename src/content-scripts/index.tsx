import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const index = document.createElement("div");

const body = document.querySelector("body");
if (body) {
  body.appendChild(index);
}

ReactDOM.createRoot(index).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
