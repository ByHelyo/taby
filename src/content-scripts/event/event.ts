import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../../type/misc";
import { MenuService } from "../../core/service/menuService.ts";
import browser from "webextension-polyfill";
import { MenuUi } from "../../core/ui/menuUi.ts";

/**
 * Listens for messages from background.
 *
 * @param menuService
 */
export const eventBackground = function (menuService: MenuService) {
  browser.runtime.onMessage.addListener(async function (
    request: MessageFromBackground,
  ) {
    if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
      if (!menuService.isDisplayed()) {
        const tabs = request.tabs || [];
        const promise = menuService.open();
        menuService.setTabs(tabs);
        menuService.setSelectedTab(tabs[0]);
        await promise;
      }
    } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
      menuService.isDisplayed() && menuService.close();
    }
  });
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

/**
 * Listens for 'resize' event.
 *
 * @param menuUi
 */
export const eventResize = function (menuUi: MenuUi) {
  window.addEventListener("resize", function () {
    menuUi.handleResize();
  });
};
