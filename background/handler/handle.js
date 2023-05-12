export const handleAskTabUrls = function (sendMessage) {
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

export const handleChangeTab = function (tab) {
  console.log(tab);
};
