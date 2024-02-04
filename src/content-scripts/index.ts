import "./index.css";
import { MenuService } from "../core/service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";
import { WindowService } from "../core/service/window.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

function main() {
  const body = document.querySelector("body");
  const window = new WindowService(Context.ContentScript);
  const menuService = new MenuService(window);
  const menuUi = menuService.getMenuUi();

  appearance_setup(menuUi.dom.root);

  if (body) {
    body.appendChild(menuUi.dom.root);
  }

  eventBackground(menuService);
  eventOutsideMenu(menuService, menuUi);
  eventResize(menuUi);
}

main();
