import { MenuService } from "../core/service/menuService.ts";
import { Context, MenuServiceOption } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";
import { eventKeydown } from "./event.ts";
import { search_open_tabs } from "../core/service/search.ts";
import { buildOpenTab } from "../core/dom/build.ts";
import { Tab } from "../type/tab.ts";
import { goToTab } from "../core/service/goto.ts";

async function main() {
  const promises: Promise<void>[] = [];
  const opts: MenuServiceOption<Tab> = {
    context: Context.Popup,
    search: search_open_tabs,
    buildElement: buildOpenTab,
    goTo: goToTab,
    placeholder: "Search open tab...",
  };
  const root = document.querySelector<HTMLDivElement>("body > div")!;
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  promises.push(appearance_setup(root));

  if (root) {
    root.prepend(menuUi.getMenuDom().getRoot());
  }

  promises.push(menuService.setupElements());

  eventKeydown(menuUi);

  await Promise.all(promises);
}

main();
