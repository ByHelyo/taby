import "./index.css";
import { MenuService } from "./service/menuService.ts";
import "./event/event";
import { eventOutsideMenu, eventBackground } from "./event/event";

const body = document.querySelector("body");
const menu = new MenuService();

if (body) {
  body.appendChild(menu.menuRepository.dom.menu);
}

eventBackground(menu);
eventOutsideMenu(menu);
