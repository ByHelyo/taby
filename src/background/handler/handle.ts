export const handleAskTabs = function (sendMessage: any) {
  chrome.tabs
    .query({
      currentWindow: true,
    })
    .then((tabs) => {
      const formattedTabs = tabs.map((tab, index) => {
        return {
          title: tab.title,
          url: tab.url,
          id: tab.id,
          index,
        };
      });
      sendMessage({ tabs: formattedTabs });
    });
};

export const handleChangeTab = function (tab: any) {
  chrome.tabs.update(tab.id, { active: true });
};
