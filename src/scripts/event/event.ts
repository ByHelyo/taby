/* Send message if TOGGLE_MENU shortcut is triggered */
import { MessageFromBackground } from "../../types/misc";

export const eventToggleMenu = function (menu) {
  chrome.runtime.onMessage.addListener(
    async (request: MessageFromBackground, sender) => {
      if (!sender.tab && request.type === "TOGGLE_MENU") {
        menu.handleMenu(request.tabs);
      }
    }
  );
};

/* Remove menu if clicking outside */
export const eventOutsideMenu = function (menu) {
  window.addEventListener("click", function (e) {
    if (!menu.dom.contains(e.target)) {
      menu.dom.displays(false);
    }
  });
};
