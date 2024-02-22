import browser, { Bookmarks } from "webextension-polyfill";
import Fuse from "fuse.js";
import { SearchableTab, Tab } from "../type/tab.ts";
import { Bookmark } from "../type/bookmark.ts";
import BookmarkTreeNode = Bookmarks.BookmarkTreeNode;
import {
  MessageFromBackground,
  MessageFromBackgroundType,
} from "../type/message.ts";
import { Resource } from "../type/resource.ts";
import { HistoryUrl } from "../type/history.ts";

/**
 * Switches to the specified url.
 *
 * @param url The url to switch to.
 */
export const handleRequestSwitchTab = async function <T extends Resource>(
  url: T,
) {
  await browser.tabs.update(url.id, { active: true });
};

export const handleRequestUpdateCurrentTab = async function <
  T extends Resource,
>(url: T) {
  await browser.tabs.update(url.id, { url: url.url });
};

/**
 * Toggles the visibility state of the menu by sending a message to the content script.
 *
 */
export const handleToggleMenu = async function () {
  const [currentTab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const message: MessageFromBackground = {
    type: MessageFromBackgroundType.TOGGLE_MENU,
  };

  if (currentTab.id) {
    await browser.tabs.sendMessage(currentTab.id, message);
  }
};

export const handleDuplicateTab = async function () {
  const [currentTab] = await browser.tabs.query({ active: true });
  await browser.tabs.create({ url: currentTab.url });
};

/**
 * Requests all open tabs in the current window and filters them based on the provided content.
 *
 * @param content The content to filter tabs by.
 * @returns {Promise<Tab[]>} Array of tabs matching the search criteria
 */
export const handleRequestSearchOpenTabs = async function (
  content: string,
): Promise<Tab[]> {
  const tabs = await browser.tabs.query({ lastFocusedWindow: true });

  if (content === "") {
    return tabs.map(Tab.from);
  }

  const options = {
    keys: ["title", "url", "key"],
  };
  const fuse = new Fuse(tabs.map(SearchableTab.from), options);

  return fuse.search(content).map(function (tab, idx) {
    return {
      title: tab.item.title,
      id: tab.item.id,
      key: tab.item.key,
      idx: idx,
      favIconUrl: tab.item.favIconUrl,
    };
  });
};

export const handleRequestSearchBookmarks = async function (
  content: string,
): Promise<Bookmark[]> {
  const bookmarks = bfs_bookmark(await browser.bookmarks.getTree());

  if (content === "") {
    return bookmarks.map((bookmark, idx) => Bookmark.from(bookmark, idx));
  }

  const options = {
    keys: ["title", "url"],
  };
  const fuse = new Fuse(bookmarks, options);

  return fuse.search(content).map(function (bookmark, idx): Bookmark {
    return Bookmark.from(bookmark.item, idx);
  });
};

function bfs_bookmark(root: BookmarkTreeNode[]): BookmarkTreeNode[] {
  const q = root;
  const bookmarks: BookmarkTreeNode[] = [];

  while (q.length > 0) {
    const node = q.pop();

    if (!node) {
      continue;
    }

    if (node.url) {
      bookmarks.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        q.push(child);
      }
    }
  }

  return bookmarks;
}

export const handleRequestSearchHistory = async function (
  content: string,
): Promise<HistoryUrl[]> {
  const history = await browser.history.search({ text: "" });

  if (content === "") {
    return history.map((history, idx) => HistoryUrl.from(history, idx));
  }

  const options = {
    keys: ["title", "url"],
  };
  const fuse = new Fuse(history, options);

  return fuse.search(content).map(function (history, idx): Bookmark {
    return HistoryUrl.from(history.item, idx);
  });
};
