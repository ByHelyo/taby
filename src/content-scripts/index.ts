import "./index.css";
import { MenuService } from "./service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";

const body = document.querySelector("body");
const menuService = new MenuService();
const menuUi = menuService.getMenuUi();

menuUi.dom.menu.style.setProperty("--background", "red");

if (body) {
  body.appendChild(menuUi.dom.menu);
}

eventBackground(menuService);
eventOutsideMenu(menuService, menuUi);
eventResize(menuUi);
