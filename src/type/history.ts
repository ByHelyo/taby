import { History } from "webextension-polyfill";
import HistoryItem = History.HistoryItem;

export class THistory {
  title: string;
  url: string;
  idx: number;

  constructor(title: string, url: string, idx: number) {
    this.title = title;
    this.url = url;
    this.idx = idx;
  }

  static from(tab: HistoryItem, idx: number): THistory {
    return {
      title: tab.title || "",
      url: tab.url || "",
      idx: idx,
    };
  }
}
