import browser from "webextension-polyfill";
import {
  handleRequestSearchTab,
  handleRequestSwitchTab,
  handleToggleMenu,
} from "./handler/handler";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
} from "../type/misc.ts";

/**
 * Listens for shortcuts.
 *
 */
browser.commands.onCommand.addListener(async function (command: string) {
  switch (command) {
    case "TOGGLE_MENU":
      await handleToggleMenu();
  }
});

/**
 * Listens for messages from content script.
 *
 */
browser.runtime.onMessage.addListener(async function (
  request: MessageFromScript,
) {
  switch (request.type) {
    case MessageFromScriptType.REQUEST_SWITCH_TAB:
      if (request.tab) {
        handleRequestSwitchTab(request.tab);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_TAB:
      if (request.search) {
        return await handleRequestSearchTab(request.search);
      }
      break;
  }
});

/**
 * Listens for events when the active tab changes within the current window.
 *
 */
browser.tabs.onActivated.addListener(async function () {
  const [currentTab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const message: MessageFromBackground = {
    type: MessageFromBackgroundType.USER_SWITCHES_TAB,
  };

  if (currentTab.id) {
    await browser.tabs.sendMessage(currentTab.id, message);
  }
});
