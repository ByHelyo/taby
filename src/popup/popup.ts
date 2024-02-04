import { MenuService } from "../core/service/menuService.ts";
import { WindowService } from "../core/service/window.ts";
import { Context } from "../type/misc.ts";

const body = document.querySelector("body");
const window = new WindowService(Context.Popup);
const menuService = new MenuService(window);
const menuUi = menuService.getMenuUi();
menuService.open();

if (body) {
  body.appendChild(menuUi.dom.menu);
}
