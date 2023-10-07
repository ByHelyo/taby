import { Tab } from "../../type/misc.ts";
import browser from "webextension-polyfill";

export const handleRequestSwitchTab = function (tab: Tab) {
  browser.tabs.update(tab.id, { active: true });
};
