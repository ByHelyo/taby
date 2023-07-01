import "./content-script.css";
import { Menu } from "./resources/menu";
import "./event/event";
import { eventOutsideMenu, eventToggleMenu } from "./event/event";

const body = document.querySelector("body");
const menu = new Menu();

if (body) {
  body.appendChild(menu.menuComponent.dom.menu);
}

eventToggleMenu(menu);
eventOutsideMenu(menu);
