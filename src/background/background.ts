import browser from "webextension-polyfill";

import { Appearance, PopupWindow, Storage } from "../type/misc.ts";
import {
  handleDuplicateTab,
  handleRequestSearchBookmarks,
  handleRequestSearchHistory,
  handleRequestSearchOpenTabs,
  handleRequestSwitchTab,
  handleRequestUpdateCurrentTab,
  handleToggleMenu,
} from "./handler.ts";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
} from "../type/message.ts";
import { Resource } from "../type/resource.ts";

browser.runtime.onInstalled.addListener(async function () {
  await browser.storage.sync
    .get([
      Storage.Appearance,
      Storage.PopupWindow,
      Storage.PositionBlock,
      Storage.PositionInline,
    ])
    .then(async function (storage) {
      const promises = [];
      if (!storage[Storage.Appearance]) {
        promises.push(
          browser.storage.sync.set({ [Storage.Appearance]: Appearance.Dark }),
        );
      }
      if (!storage[Storage.PopupWindow]) {
        promises.push(
          browser.storage.sync.set({
            [Storage.PopupWindow]: PopupWindow.UnFixed,
          }),
        );
      }
      if (!storage[Storage.PositionInline]) {
        promises.push(
          browser.storage.sync.set({
            [Storage.PositionInline]: "20",
          }),
        );
      }
      if (!storage[Storage.PositionBlock]) {
        promises.push(
          browser.storage.sync.set({
            [Storage.PositionBlock]: "10",
          }),
        );
      }

      await Promise.all(promises);
    });
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
browser.runtime.onMessage.addListener(async function <T extends Resource>(
  request: MessageFromScript<T>,
) {
  switch (request.type) {
    case MessageFromScriptType.REQUEST_SWITCH_TAB:
      if (request.element) {
        await handleRequestSwitchTab(request.element);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_OPEN_TABS:
      if (request.search !== undefined) {
        return await handleRequestSearchOpenTabs(request.search);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_BOOKMARKS:
      if (request.search !== undefined) {
        return await handleRequestSearchBookmarks(request.search);
      }
      break;
    case MessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB:
      if (request.element) {
        await handleRequestUpdateCurrentTab(request.element);
      }
      break;
    case MessageFromScriptType.REQUEST_SEARCH_HISTORY:
      if (request.search != undefined) {
        return await handleRequestSearchHistory(request.search);
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
