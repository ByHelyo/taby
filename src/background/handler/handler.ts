import { Tab } from "../../type/misc.ts";

export const handleRequestSwitchTab = function (tab: Tab) {
  chrome.tabs.update(tab.id, { active: true });
};
