import browser from "webextension-polyfill";
import {
  handleRequestSearchTab,
  handleRequestSwitchTab,
} from "./handler/handler";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../type/misc.ts";

browser.commands.onCommand.addListener(async function (command: string) {
  if (command === "TOGGLE_MENU") {
    const [currentTab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const tabs: Tab[] = await browser.tabs
      .query({
        currentWindow: true,
      })
      .then((tabs) => {
        const formattedTabs: Tab[] = tabs.map((tab, index) => {
          return {
            title: tab.title || "",
            id: tab.id || 0,
            key: index + 1,
            internalIndex: index,
          };
        });
        return formattedTabs;
      });

    const message: MessageFromBackground = {
      type: MessageFromBackgroundType.TOGGLE_MENU,
      tabs,
    };

    if (currentTab.id) {
      await browser.tabs.sendMessage(currentTab.id, message);
    }
  }
});

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
