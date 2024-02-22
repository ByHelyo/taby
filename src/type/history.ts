import { History } from "webextension-polyfill";
import HistoryItem = History.HistoryItem;

export class HistoryUrl {
  title: string;
  url: string;
  idx: number;

  constructor(title: string, url: string, idx: number) {
    this.title = title;
    this.url = url;
    this.idx = idx;
  }

  static from(tab: HistoryItem, idx: number): HistoryUrl {
    return {
      title: tab.title || "",
      url: tab.url || "",
      idx: idx,
    };
  }
}
