import { TMessageFromScript, EMessageFromScriptType } from "../type/message.ts";
import { EAppearance, EPopupWindow, EScroll, EStorage } from "../type/misc.ts";
import {
  handleDuplicateTab,
  handleRequestSearchBookmarks,
  handleRequestSearchHistory,
  handleRequestSearchOpenTabs,
  handleRequestSwitchTab,
  handleRequestUpdateCurrentTab,
} from "./handler.ts";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(async function () {
  await browser.storage.local
    .get([EStorage.Appearance, EStorage.PopupWindow, EStorage.Scroll])
    .then(async function (storage) {
      const promises = [];
      if (!storage[EStorage.Appearance]) {
        promises.push(
          browser.storage.local.set({
            [EStorage.Appearance]: EAppearance.Light,
          }),
        );
      }
      if (!storage[EStorage.PopupWindow]) {
        promises.push(
          browser.storage.local.set({
            [EStorage.PopupWindow]: EPopupWindow.Fixed,
          }),
        );
      }
      if (!storage[EStorage.Scroll]) {
        promises.push(
          browser.storage.local.set({
            [EStorage.Scroll]: EScroll.Default,
          }),
        );
      }

      await Promise.all(promises);
    });
});

browser.commands.onCommand.addListener(async function (command: string) {
  switch (command) {
    case "DUPLICATE_TAB":
      await handleDuplicateTab();
      break;
  }
});

browser.runtime.onMessage.addListener(async function (
  request: TMessageFromScript,
) {
  console.log(request);
  switch (request.type) {
    case EMessageFromScriptType.REQUEST_SWITCH_TAB:
      if (request.element) {
        await handleRequestSwitchTab(request.element);
      }
      break;
    case EMessageFromScriptType.REQUEST_SEARCH_OPEN_TABS:
      if (request.search !== undefined) {
        return await handleRequestSearchOpenTabs(request.search);
      }
      break;
    case EMessageFromScriptType.REQUEST_SEARCH_BOOKMARKS:
      if (request.search !== undefined) {
        return await handleRequestSearchBookmarks(request.search as string);
      }
      break;
    case EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB:
      if (request.element) {
        await handleRequestUpdateCurrentTab(request.element, {
          newTab: request.newTab || false,
        });
      }
      break;
    case EMessageFromScriptType.REQUEST_SEARCH_HISTORY:
      if (request.search != undefined) {
        return await handleRequestSearchHistory(request.search);
      }
      break;
  }
});
