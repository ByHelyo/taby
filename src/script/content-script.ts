import "./content-script.css";
import { Menu } from "./resource/menu";
import "./event/event";
import { eventOutsideMenu, eventBackground } from "./event/event";

const body = document.querySelector("body");
const menu = new Menu();

if (body) {
  body.appendChild(menu.menuComponent.dom.menu);
}

eventBackground(menu);
eventOutsideMenu(menu);
