import { MenuService } from "../core/service/menuService.ts";
import { WindowService } from "../core/service/window.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

async function main() {
  const body = document.querySelector("body");
  const window = new WindowService(Context.Popup);
  const menuService = new MenuService(window);
  const menuUi = menuService.getMenuUi();

  appearance_setup(menuUi.dom.root);

  if (body) {
    body.appendChild(menuUi.dom.root);
  }

  menuService.open();
  menuService.setup();
}

main();
