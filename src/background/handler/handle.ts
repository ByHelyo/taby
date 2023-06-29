export const handleChangeTab = function (tab: any) {
  chrome.tabs.update(tab.id, { active: true });
};
