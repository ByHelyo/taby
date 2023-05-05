chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_MENU",
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendMessage) {
  chrome.tabs.query({}).then((tabs) => {
    const urls = tabs.map((tab) => tab.url);

    sendMessage({ urls });
  });

  return true;
});
