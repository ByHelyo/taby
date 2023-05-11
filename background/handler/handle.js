export const handleAskTabUrls = function (sendMessage) {
  chrome.tabs.query({}).then((tabs) => {
    const urls = tabs.map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
      };
    });

    sendMessage({ urls });
  });
};

export const handleChangeTab = function () {};
