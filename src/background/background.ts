import browser from "webextension-polyfill";

import {
  Appearance,
  Id,
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
} from "../type/misc.ts";
import {
  handleDuplicateTab,
  handleRequestSearchBookmarks,
  handleRequestSearchTabs,
  handleRequestSwitchTab,
  handleToggleMenu,
} from "./handler.ts";

browser.runtime.onInstalled.addListener(async function () {
  await browser.storage.local.set({ appearance: Appearance.Light });
});

/**
 * Listens for shortcuts.
 *
 */
browser.commands.onCommand.addListener(async function (command: string) {
  switch (command) {
    case "TOGGLE_MENU":
      await handleToggleMenu();
      break;
    case "DUPLICATE_TAB":
      await handleDuplicateTab();
      break;
  }
});

/**
 * Listens for messages from content script.
 *
 */
browser.runtime.onMessage.addListener(async function <T extends Id>(
  request: MessageFromScript<T>,
) {
  switch (request.type) {
    case MessageFromScriptType.REQUEST_SWITCH_TAB:
      if (request.tab) {
        await handleRequestSwitchTab(request.tab);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_OPEN_TABS:
      if (request.search !== undefined) {
        return await handleRequestSearchTabs(request.search);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_BOOKMARKS:
      if (request.search !== undefined) {
        return await handleRequestSearchBookmarks(request.search);
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
