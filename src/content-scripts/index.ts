import "./index.css";
import { MenuService } from "../core/service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

function main() {
  const body = document.querySelector("body");
  const menuService = new MenuService(Context.ContentScript);
  const menuUi = menuService.getMenuUi();

  appearance_setup(menuUi.getMenuDom().getRoot());

  if (body) {
    body.appendChild(menuUi.getMenuDom().getRoot());
  }

  eventBackground(menuService);
  eventOutsideMenu(menuService, menuUi);
  eventResize(menuUi);
}

main();
