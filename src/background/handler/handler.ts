import {
  MessageFromBackground,
  MessageFromBackgroundType,
  SearchableTab,
  Tab,
} from "../../type/misc.ts";
import browser from "webextension-polyfill";
import Fuse from "fuse.js";

/**
 *
 * Switches to the specified tab.
 *
 * @param tab The tab to switch to.
 */
export const handleRequestSwitchTab = function (tab: Tab) {
  browser.tabs.update(tab.id, { active: true });
};

/**
 *
 * Requests all open tabs in the current window and filters them based on the provided content.
 *
 * @param content The content to filter tabs by.
 * @returns {Promise<Tab[]>} Array of tabs matching the search criteria
 */
export const handleRequestSearchTab = async function (
  content: string,
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

  return fuse.search(content).map((tab, ind) => {
    return {
      title: tab.item.title,
      id: tab.item.id,
      key: tab.item.key,
      internalIndex: ind,
    };
  });
};

/**
 *
 * Toggles the visibility state of the menu by requesting all tabs in the current window and sending a message to the content script.
 *
 */
export const handleToggleMenu = async function () {
  const [currentTab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const tabs: Tab[] = await browser.tabs
    .query({
      currentWindow: true,
    })
    .then((browserTabs) => {
      const tabs: Tab[] = browserTabs.map((tab, index) => {
        return {
          title: tab.title || "",
          id: tab.id || 0,
          key: index + 1,
          internalIndex: index,
        };
      });
      return tabs;
    });

  const message: MessageFromBackground = {
    type: MessageFromBackgroundType.TOGGLE_MENU,
    tabs,
  };

  if (currentTab.id) {
    await browser.tabs.sendMessage(currentTab.id, message);
  }
};
