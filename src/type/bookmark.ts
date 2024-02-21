import { Bookmarks } from "webextension-polyfill";
import BookmarkTreeNode = Bookmarks.BookmarkTreeNode;

export class Bookmark {
  title: string;
  url: string;
  idx: number;

  constructor(title: string, url: string, idx: number) {
    this.title = title;
    this.url = url;
    this.idx = idx;
  }

  static from(tab: BookmarkTreeNode, idx: number): Bookmark {
    return {
      title: tab.title || "",
      url: tab.url || "",
      idx: idx,
    };
  }
}
