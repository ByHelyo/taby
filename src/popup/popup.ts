import { MenuService } from "../core/service/menuService.ts";
import { WindowService } from "../core/service/window.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

async function main() {
  const root = document.querySelector<HTMLDivElement>("body > div")!;
  const window = new WindowService(Context.Popup);
  const menuService = new MenuService(window);
  const menuUi = menuService.getMenuUi();

  appearance_setup(root);

  if (root) {
    root.prepend(menuUi.getMenuDom().getRoot());
  }

  menuService.open();
  menuService.setupTabs();
}

main();
