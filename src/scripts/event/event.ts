/* Send message if TOGGLE_MENU shortcut is triggered */
import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../../types/misc";
import { Menu } from "../resources/menu.ts";

export const eventToggleMenu = function (menu: Menu) {
  chrome.runtime.onMessage.addListener(
    async (request: MessageFromBackground, sender) => {
      if (
        !sender.tab &&
        request.type === MessageFromBackgroundType.TOGGLE_MENU
      ) {
        menu.isDisplayed() ? menu.closeMenu() : menu.openMenu(request.tabs);
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
