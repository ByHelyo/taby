import { buildMenu } from "./build/menu";

import "./content-script.css";
import { handleMenu } from "./handler/handler";

const body = document.querySelector("body");
const menu = buildMenu();

if (body) {
  body.appendChild(menu);
}

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (!sender.tab && request.type === "TOGGLE_MENU") {
    handleMenu(menu);
  }
});
