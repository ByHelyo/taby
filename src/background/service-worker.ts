import { handleChangeTab } from "./handler/handle";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
} from "../types/misc.ts";

chrome.commands.onCommand.addListener(async function (command: string) {
  if (command === "TOGGLE_MENU") {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const tabs = await chrome.tabs
      .query({
        currentWindow: true,
      })
      .then((tabs) => {
        const formattedTabs: any = tabs.map((tab, index) => {
          return {
            title: tab.title,
            url: tab.url,
            id: tab.id,
            index,
          };
        });
        return formattedTabs;
      });

    const message: MessageFromBackground = {
      type: MessageFromBackgroundType.TOGGLE_MENU,
      tabs,
    };

    if (currentTab.id) {
      await chrome.tabs.sendMessage(currentTab.id, message);
    }
  }
});

chrome.runtime.onMessage.addListener(function (request: MessageFromScript) {
  switch (request.type) {
    case MessageFromScriptType.CHANGE_TAB:
      handleChangeTab(request.tab);
  }
});
