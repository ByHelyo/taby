import "./content-script.css";
import { Menu } from "./menu/menu";

const body = document.querySelector("body");
const menu = new Menu();

if (body) {
  body.appendChild(menu.dom.menu);
}

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (!sender.tab && request.type === "TOGGLE_MENU") {
    const { urls } = await chrome.runtime.sendMessage({ type: "ASK_TAB_URLS" });

    menu.handleMenu(urls);
  }
});
