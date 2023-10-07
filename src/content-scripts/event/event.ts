/* Send message if TOGGLE_MENU shortcut is triggered */
import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../../type/misc";
import { Menu } from "../resource/menu.ts";
import browser from "webextension-polyfill";

export const eventBackground = function (menu: Menu) {
  browser.runtime.onMessage.addListener(
    async (request: MessageFromBackground) => {
      if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
        menu.isDisplayed()
          ? menu.closeMenu()
          : menu.openMenu(request.tabs || []);
      }
      if (request.type == MessageFromBackgroundType.USER_SWITCHES_TAB) {
        menu.isDisplayed() && menu.closeMenu();
      }
    }
  );
};

/* Remove menu if clicking outside */
export const eventOutsideMenu = function (menu: Menu) {
  window.addEventListener("click", function (e) {
    if (!menu.menuComponent.contains(e.target as HTMLElement)) {
      menu.closeMenu();
    }
  });
};
