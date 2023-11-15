import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../../type/misc";
import { MenuService } from "../service/menuService.ts";
import browser from "webextension-polyfill";
import { MenuUi } from "../ui/menuUi.ts";

/**
 * Listens for messages from background.
 *
 * @param menu
 */
export const eventBackground = function (menu: MenuService) {
  browser.runtime.onMessage.addListener(
    async (request: MessageFromBackground) => {
      if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
        if (menu.isDisplayed()) {
          menu.close();
        } else {
          const tabs = request.tabs || [];
          menu.open();
          menu.setTabs(tabs);
          menu.setSelectedTab(tabs[0]);
        }
      } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
        menu.isDisplayed() && menu.close();
      }
    },
  );
};

/**
 * Listens for 'click' events.
 *
 * @param menuService
 * @param menuUi
 */
export const eventOutsideMenu = function (
  menuService: MenuService,
  menuUi: MenuUi,
) {
  window.addEventListener("click", function (e) {
    if (!menuUi.contains(e.target as HTMLElement)) {
      menuService.close();
    }
  });
};
