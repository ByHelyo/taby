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
        if (menu.isDisplayed()) {
          menu.closeMenu();
        } else {
          // TODO set tabs and set selected tabs
          const tabs = request.tabs || [];
          menu.openMenu();
          menu.setTabs(tabs);
          menu.setDisplayedTabs(tabs);
          menu.setSelectedTab(tabs[0]);
        }
      }
      if (request.type == MessageFromBackgroundType.USER_SWITCHES_TAB) {
        menu.isDisplayed() && menu.closeMenu();
      }
    },
  );
};

/* Remove menu if clicking outside */
export const eventOutsideMenu = function (menu: Menu) {
  window.addEventListener("click", function (e) {
    if (!menu.menuService.contains(e.target as HTMLElement)) {
      menu.closeMenu();
    }
  });
};
