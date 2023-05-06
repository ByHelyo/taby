import "./content-script.css";
import { Menu } from "./menu/menu";
import "./event/event";
import { eventOutsideMenu, eventToggleMenu } from "./event/event";

const body = document.querySelector("body");
const menu = new Menu();

if (body) {
  body.appendChild(menu.dom.menu);
}

eventToggleMenu(menu);
eventOutsideMenu(menu);
