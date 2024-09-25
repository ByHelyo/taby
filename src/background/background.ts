import browser from "webextension-polyfill";
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
  TMessageFromBackground,
  EMessageFromBackgroundType,
  TMessageFromScript,
  EMessageFromScriptType,
} from "../type/message.ts";
import { EAppearance, EPopupWindow, EScroll, EStorage } from "../type/misc.ts";
import { TTab } from "~/type/tab.tsx";

browser.runtime.onInstalled.addListener(async function () {
  await browser.storage.local
    .get([
      EStorage.Appearance,
      EStorage.PopupWindow,
      EStorage.PositionBlock,
      EStorage.PositionInline,
      EStorage.Scroll,
      EStorage.CommandPaletteWidth,
    ])
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
      if (!storage[EStorage.PositionInline]) {
        promises.push(
          browser.storage.local.set({
            [EStorage.PositionInline]: "20",
          }),
        );
      }
      if (!storage[EStorage.PositionBlock]) {
        promises.push(
          browser.storage.local.set({
            [EStorage.PositionBlock]: "10",
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
      promises.push(
        browser.storage.local.set({
          [EStorage.CommandPaletteWidth]: "60",
        }),
      );

      await Promise.all(promises);
    });
});

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

browser.runtime.onMessage.addListener(async function (
  request: TMessageFromScript<unknown>,
) {
  switch (request.type) {
    case EMessageFromScriptType.REQUEST_SWITCH_TAB:
      if (request.element) {
        await handleRequestSwitchTab(request.element as TTab);
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
        await handleRequestUpdateCurrentTab(request.element as TTab);
      }
      break;
    case EMessageFromScriptType.REQUEST_SEARCH_HISTORY:
      if (request.search != undefined) {
        return await handleRequestSearchHistory(request.search);
      }
      break;
  }
});

browser.tabs.onActivated.addListener(async function () {
  const [currentTab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const message: TMessageFromBackground = {
    type: EMessageFromBackgroundType.USER_SWITCHES_TAB,
  };

  if (currentTab.id) {
    await browser.tabs.sendMessage(currentTab.id, message);
  }
});
