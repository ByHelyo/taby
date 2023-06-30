import { Tab } from "../../types/misc.ts";

export const handleChangeTab = function (tab: Tab) {
  chrome.tabs.update(tab.id, { active: true });
};
