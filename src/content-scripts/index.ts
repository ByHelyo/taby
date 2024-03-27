import "./index.css";
import { MenuService } from "../core/service/menuService.ts";
import "./event/event";
import { eventBackground, eventOutsideMenu, eventResize } from "./event/event";
import { Context, MenuServiceOption } from "../type/misc.ts";
import { popup_setup } from "../core/setup/popup.ts";
import { search_open_tabs } from "../core/service/search.ts";
import { buildOpenTab, buildRoot } from "../core/dom/build.ts";
import { Tab } from "../type/tab.ts";
import { goToTab } from "../core/service/goto.ts";

async function main() {
  const opts: MenuServiceOption<Tab> = {
    context: Context.ContentScript,
    search: search_open_tabs,
    buildElement: buildOpenTab,
    goTo: goToTab,
    placeholder: "Search open tab...",
  };
  const body = document.querySelector("body");
  const root = buildRoot();

  const promise = popup_setup(root, opts.context);

  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  if (body) {
    body.appendChild(root);
    root.appendChild(menuUi.getMenuDom().getDom());
  }

  eventBackground(menuService);
  eventOutsideMenu(menuService, menuUi);
  eventResize(menuUi);

  await promise;
}

main();
