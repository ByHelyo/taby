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
    const promises: Promise<void>[] = [];

    if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
      if (!menuService.isDisplayed()) {
        promises.push(menuService.open());
        promises.push(menuService.setupTabs());
      }
    } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
      menuService.isDisplayed() && promises.push(menuService.close());
    }

    return Promise.all(promises);
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
  window.addEventListener("click", async function (e) {
    if (!menuUi.contains(e.target as HTMLElement)) {
      await menuService.close();
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
