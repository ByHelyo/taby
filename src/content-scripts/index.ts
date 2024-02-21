import "./index.css";
import { MenuService } from "../core/service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";
import { search_open_tabs } from "../core/service/search.ts";
import { buildOpenTab } from "../core/dom/build.ts";

async function main() {
  const opts = {
    context: Context.ContentScript,
    search: search_open_tabs,
    buildElement: buildOpenTab,
  };
  const body = document.querySelector("body");
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  const promise = appearance_setup(menuUi.getMenuDom().getRoot());

  if (body) {
    body.appendChild(menuUi.getMenuDom().getRoot());
  }

  eventBackground(menuService);
  eventOutsideMenu(menuService, menuUi);
  eventResize(menuUi);

  await promise;
}

main();
