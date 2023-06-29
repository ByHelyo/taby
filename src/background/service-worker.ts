import { handleAskTabs, handleChangeTab } from "./handler/handle";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
} from "../types/misc.ts";

chrome.commands.onCommand.addListener(async function () {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const message: MessageFromBackground = {
    type: MessageFromBackgroundType.TOGGLE_MENU,
  };

  if (tab.id) {
    await chrome.tabs.sendMessage(tab.id, message);
  }
});

chrome.runtime.onMessage.addListener(function (
  request: MessageFromScript,
  _: chrome.runtime.MessageSender,
  sendMessage: any
) {
  switch (request.type) {
    case MessageFromScriptType.ASK_TABS:
      handleAskTabs(sendMessage);
      return true;
    case MessageFromScriptType.CHANGE_TAB:
      handleChangeTab(request.tab);
  }
});
