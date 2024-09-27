import browser, { Bookmarks, History } from "webextension-polyfill";
import BookmarkTreeNode = Bookmarks.BookmarkTreeNode;
import HistoryItem = History.HistoryItem;

export class TTab {
  title: string;
  url: string;
  idx: number;
  id: number | null;
  key: number | null;
  favIconUrl: string | null;

  constructor(
    title: string,
    url: string,
    idx: number,
    id: number | null,
    key: number | null,
    favIconUrl: string | null,
  ) {
    this.title = title;
    this.id = id;
    this.key = key;
    this.idx = idx;
    this.url = url;
    this.favIconUrl = favIconUrl;
  }

  static fromTab(tab: browser.Tabs.Tab): TTab {
    return new TTab(
      tab.title || "",
      tab.url || "",
      tab.index,
      tab.id || 0,
      tab.index + 1,
      tab.favIconUrl || "",
    );
  }

  static fromBookmark(bookmark: BookmarkTreeNode, idx: number): TTab {
    return new TTab(
      bookmark.title || "",
      bookmark.url || "",
      idx,
      null,
      null,
      null,
    );
  }

  static fromHistory(history: HistoryItem, idx: number): TTab {
    return new TTab(
      history.title || "",
      history.url || "",
      idx,
      null,
      null,
      null,
    );
  }
}
