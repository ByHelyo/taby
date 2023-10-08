import browser from "webextension-polyfill";
import { handleRequestSwitchTab } from "./handler/handler";
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
            url: tab.url || "",
            id: tab.id || 0,
            index: index,
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

browser.runtime.onMessage.addListener(function (request: MessageFromScript) {
  switch (request.type) {
    case MessageFromScriptType.REQUEST_SWITCH_TAB:
      handleRequestSwitchTab(request.tab);
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
