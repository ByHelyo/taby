import { MenuService } from "../core/service/menuService.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";
import { eventKeydown } from "./event.ts";

async function main() {
  const promises: Promise<void>[] = [];
  const opts = {
    context: Context.Popup,
  };
  const root = document.querySelector<HTMLDivElement>("body > div")!;
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  promises.push(appearance_setup(root));

  if (root) {
    root.prepend(menuUi.getMenuDom().getRoot());
  }

  promises.push(menuService.setupTabs());

  eventKeydown(menuUi);

  await Promise.all(promises);
}

main();
