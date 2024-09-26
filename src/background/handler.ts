import browser from "webextension-polyfill";
import {
  TMessageFromBackground,
  EMessageFromBackgroundType,
} from "../type/message";
import { TTab } from "../type/tab.tsx";
import Fuse from "fuse.js";
import { THistory } from "~/type/history.ts";
import { bfs_bookmark } from "./misc.ts";
import { TBookmark } from "~/type/bookmark.ts";

export const handleToggleMenu = async function () {
  const [currentTab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  const message: TMessageFromBackground = {
    type: EMessageFromBackgroundType.TOGGLE_MENU,
  };

  if (currentTab.id) {
    await browser.tabs.sendMessage(currentTab.id, message);
  }
};

export const handleDuplicateTab = async function () {
  const [currentTab] = await browser.tabs.query({ active: true });
  await browser.tabs.create({ url: currentTab.url });
};

export const handleRequestSwitchTab = async function (tab: TTab) {
  await browser.tabs.update(tab.id, { active: true });
};

export const handleRequestUpdateCurrentTab = async function (url: TTab) {
  await browser.tabs.update(url.id, { url: url.url });
};

export const handleRequestSearchOpenTabs = async function (
  content: string,
): Promise<TTab[]> {
  const tabs = await browser.tabs.query({ lastFocusedWindow: true });

  if (content === "") {
    return tabs.map(TTab.from);
  }

  const options = {
    keys: ["title", "url", "key"],
  };
  const fuse = new Fuse(tabs.map(TTab.from), options);

  return fuse.search(content).map(function (tab, idx) {
    return {
      ...tab.item,
      idx,
    };
  });
};

export const handleRequestSearchBookmarks = async function (
  content: string,
): Promise<TBookmark[]> {
  const bookmarks = bfs_bookmark(await browser.bookmarks.getTree());

  if (content === "") {
    return bookmarks.map((bookmark, idx) => TBookmark.from(bookmark, idx));
  }

  const options = {
    keys: ["title", "url"],
  };
  const fuse = new Fuse(bookmarks, options);

  return fuse.search(content).map(function (bookmark, idx): TBookmark {
    return TBookmark.from(bookmark.item, idx);
  });
};

export const handleRequestSearchHistory = async function (
  content: string,
): Promise<THistory[]> {
  const history = await browser.history.search({
    text: "",
    maxResults: 10000,
    startTime: 0,
  });

  if (content === "") {
    return history.map((history, idx) => THistory.from(history, idx));
  }

  const options = {
    keys: ["title", "url"],
  };
  const fuse = new Fuse(history, options);

  return fuse.search(content).map(function (history, idx): THistory {
    return THistory.from(history.item, idx);
  });
};
