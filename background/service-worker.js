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
  chrome.tabs.query({}).then((tabs) => {
    const urls = tabs.map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
      };
    });

    sendMessage({ urls });
  });

  return true;
});
