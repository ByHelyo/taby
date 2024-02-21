import { Bookmarks } from "webextension-polyfill";
import BookmarkTreeNode = Bookmarks.BookmarkTreeNode;

export class Bookmark {
  title: string;
  id: number;
  url: string;
  idx: number;

  constructor(title: string, id: number, url: string, idx: number) {
    this.title = title;
    this.id = id;
    this.url = url;
    this.idx = idx;
  }

  static from(tab: BookmarkTreeNode, idx: number): Bookmark {
    return {
      title: tab.title || "",
      id: Number(tab.id) || 0,
      url: tab.url || "",
      idx: idx,
    };
  }
}
