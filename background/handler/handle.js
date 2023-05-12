export const handleAskTabs = function (sendMessage) {
  chrome.tabs.query({}).then((tabs) => {
    const formattedTabs = tabs.map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
        id: tab.id,
      };
    });
    sendMessage({ tabs: formattedTabs });
  });
};

export const handleChangeTab = function (tabId, tab) {
  chrome.tabs.update(tab.id, { active: true });
};
