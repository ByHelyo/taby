import { MenuService } from "../core/service/menuService.ts";
import { WindowService } from "../core/service/window.ts";
import { Context } from "../type/misc.ts";
import { appearance_setup } from "../core/setup/appearance.ts";

const body = document.querySelector("body");
const window = new WindowService(Context.Popup);
const menuService = new MenuService(window);
const menuUi = menuService.getMenuUi();
menuService.open();

appearance_setup(menuUi);

if (body) {
  body.appendChild(menuUi.dom.menu);
}
