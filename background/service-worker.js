chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  chrome.tabs.sendMessage(tab.id, {
    type: "TOGGLE_MENU",
  });
});
