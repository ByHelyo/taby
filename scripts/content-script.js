import { buildMenu } from "./dom/menu/build";
import { handleMenu } from "./handler/handler";
import "./content-script.css";

const body = document.querySelector("body");
const menu = buildMenu();

if (body) {
  body.appendChild(menu);
}

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (!sender.tab && request.type === "TOGGLE_MENU") {
    const { urls } = await chrome.runtime.sendMessage({ type: "ASK_TAB_URLS" });

    handleMenu(menu, urls);
  }
});
