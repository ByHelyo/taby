import { MenuService } from "../core/service/menuService.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

async function main() {
  const root = document.querySelector<HTMLDivElement>("body > div")!;
  const menuService = new MenuService(Context.Popup);
  const menuUi = menuService.getMenuUi();

  appearance_setup(root);

  if (root) {
    root.prepend(menuUi.getMenuDom().getRoot());
  }

  menuService.open();
  menuService.setupTabs();
}

main();
