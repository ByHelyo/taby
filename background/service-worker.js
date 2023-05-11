import { handleAskTabUrls, handleChangeTab } from "./handler/handle";

chrome.commands.onCommand.addListener(async function (command) {
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
    case "ASK_TAB_URLS":
      handleAskTabUrls(sendMessage);
      return true;
    case "CHANGE_TAB":
      handleChangeTab();
  }
});
