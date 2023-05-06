/* Send message if TOGGLE_MENU shortcut is triggered */
export const eventToggleMenu = function (menu) {
  chrome.runtime.onMessage.addListener(async (request, sender) => {
    if (!sender.tab && request.type === "TOGGLE_MENU") {
      const { urls } = await chrome.runtime.sendMessage({
        type: "ASK_TAB_URLS",
      });

      menu.handleMenu(urls);
    }
  });
};

/* Remove menu if clicking outside */
export const eventOutsideMenu = function (menu) {
  window.addEventListener("click", function (e) {
    if (!menu.contains(e.target)) {
      menu.displays(false);
    }
  });
};
