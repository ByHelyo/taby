import browser from "webextension-polyfill";

export class TTab {
  title: string;
  url: string;
  id: number;
  key: number;
  idx: number;
  favIconUrl: string;

  constructor(
    title: string,
    url: string,
    id: number,
    key: number,
    idx: number,
    favIconUrl: string,
  ) {
    this.title = title;
    this.id = id;
    this.key = key;
    this.idx = idx;
    this.url = url;
    this.favIconUrl = favIconUrl;
  }

  static from(tab: browser.Tabs.Tab): TTab {
    return new TTab(
      tab.title || "",
      tab.url || "",
      tab.id || 0,
      tab.index + 1,
      tab.index,
      tab.favIconUrl || "",
    );
  }
}
