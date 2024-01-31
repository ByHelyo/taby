import browser from "webextension-polyfill";
import Fuse from "fuse.js";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  SearchableTab,
  Tab,
} from "../type/misc.ts";

/**
 * Switches to the specified tab.
 *
 * @param tab The tab to switch to.
 */
export const handleRequestSwitchTab = function (tab: Tab) {
  browser.tabs.update(tab.id, { active: true });
};

/**
 * Requests all open tabs in the current window and filters them based on the provided content.
 *
 * @param content The content to filter tabs by.
 * @returns {Promise<Tab[]>} Array of tabs matching the search criteria
 */
export const handleRequestSearchTab = async function (
  content: string,
): Promise<Tab[]> {
  const tabs = await browser.tabs.query({
    currentWindow: true,
  });

  if (content === "") {
    return tabs.map(Tab.from);
  }

  const options = {
    keys: ["title", "url", "key"],
  };
  const fuse = new Fuse(tabs.map(SearchableTab.from), options);

  return fuse.search(content).map((tab, idx) => {
    return {
      title: tab.item.title,
      id: tab.item.id,
      key: tab.item.key,
      idx: idx,
      favIconUrl: tab.item.favIconUrl,
    };
  });
};

/**
 * Toggles the visibility state of the menu by requesting all tabs in the current window and sending a message to the content script.
 *
 */
export const handleToggleMenu = async function () {
  let activeTabId = 0;

  const tabs: Tab[] = await browser.tabs
    .query({
      currentWindow: true,
    })
    .then((browserTabs) => {
      const tabs: Tab[] = browserTabs.map((tab) => {
        if (tab.active) {
          activeTabId = tab.id || 0;
        }

        return Tab.from(tab);
      });
      return tabs;
    });

  const message: MessageFromBackground = {
    type: MessageFromBackgroundType.TOGGLE_MENU,
    tabs,
  };

  await browser.tabs.sendMessage(activeTabId, message);
};

export const handleDuplicateTab = async function () {
  const currentTab = await browser.tabs.query({ active: true });
  await browser.tabs.create({ url: currentTab[0].url });
};
