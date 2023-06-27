import { handleAskTabs, handleChangeTab } from "./handler/handle";

chrome.commands.onCommand.addListener(async function () {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_MENU",
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendMessage) {
  switch (request.type) {
    case "ASK_TABS":
      handleAskTabs(sendMessage);
      return true;
    case "CHANGE_TAB":
      handleChangeTab(sender.tab.id, request.tab);
  }
});
