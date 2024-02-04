import "./index.css";
import { MenuService } from "./service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";
import browser from "webextension-polyfill";
import { handleChangeAppearance } from "./handler/handler.ts";

const body = document.querySelector("body");
const menuService = new MenuService();
const menuUi = menuService.getMenuUi();

browser.storage.local.get(["appearance"]).then((storage) => {
  const theme = storage.appearance;
  handleChangeAppearance(menuUi, theme);
});

browser.storage.onChanged.addListener((changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key === "appearance") {
      handleChangeAppearance(menuUi, newValue);
    }
  }
});

if (body) {
  body.appendChild(menuUi.dom.menu);
}

eventBackground(menuService);
eventOutsideMenu(menuService, menuUi);
eventResize(menuUi);
