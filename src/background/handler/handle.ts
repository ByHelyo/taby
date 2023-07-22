import { Tab } from "../../types/misc.ts";

export const handleRequestSwitchTab = function (tab: Tab) {
  chrome.tabs.update(tab.id, { active: true });
};
