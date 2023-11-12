import { SearchableTab, Tab } from "../../type/misc.ts";
import browser from "webextension-polyfill";
import Fuse from "fuse.js";

export const handleRequestSwitchTab = function (tab: Tab) {
  browser.tabs.update(tab.id, { active: true });
};

export const handleRequestSearchTab = async function (
  search: string,
): Promise<Tab[]> {
  const tabs: SearchableTab[] = await browser.tabs
    .query({
      currentWindow: true,
    })
    .then((browserTabs) => {
      const tabs: SearchableTab[] = browserTabs.map((tab, ind) => {
        return {
          title: tab.title || "",
          id: tab.id || 0,
          url: tab.url || "",
          key: ind + 1,
        };
      });
      return tabs;
    });

  const options = {
    keys: ["title", "url", "key"],
  };
  const fuse = new Fuse(tabs, options);

  return fuse.search(search).map((tab, ind) => {
    return {
      title: tab.item.title,
      id: tab.item.id,
      key: tab.item.key,
      internalIndex: ind,
    };
  });
};
