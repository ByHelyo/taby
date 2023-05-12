export const handleAskTabs = function (sendMessage) {
  chrome.tabs.query({}).then((tabs) => {
    const formattedTabs = tabs.map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
      };
    });

    sendMessage({ tabs: formattedTabs });
  });
};

export const handleChangeTab = function (tab) {
  console.log(tab);
};
