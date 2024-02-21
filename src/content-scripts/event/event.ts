import { MenuService } from "../../core/service/menuService.ts";
import browser from "webextension-polyfill";
import { MenuUi } from "../../core/ui/menuUi.ts";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../../type/message.ts";
import { Resource } from "../../type/resource.ts";

/**
 * Listens for messages from background.
 *
 * @param menuService
 */
export const eventBackground = function <T extends Resource>(
  menuService: MenuService<T>,
) {
  browser.runtime.onMessage.addListener(async function (
    request: MessageFromBackground,
  ) {
    if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
      if (!menuService.isDisplayed()) {
        await menuService.setupElements();
      } else {
        await menuService.close();
      }
    } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
      menuService.isDisplayed() && (await menuService.close());
    }
  });
};

/**
 * Listens for 'click' events.
 *
 * @param menuService
 * @param menuUi
 */
export const eventOutsideMenu = function <T extends Resource>(
  menuService: MenuService<T>,
  menuUi: MenuUi<T>,
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
export const eventResize = function <T extends Resource>(menuUi: MenuUi<T>) {
  window.addEventListener("resize", function () {
    menuUi.handleResize();
  });
};
