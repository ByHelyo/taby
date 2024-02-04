import browser from "webextension-polyfill";

export class Tab {
  title: string;
  id: number;
  key: number;
  idx: number;
  favIconUrl: string;

  constructor(
    title: string,
    id: number,
    key: number,
    idx: number,
    favIconUrl: string,
  ) {
    this.title = title;
    this.id = id;
    this.key = key;
    this.idx = idx;
    this.favIconUrl = favIconUrl;
  }

  static from(tab: browser.Tabs.Tab): Tab {
    return {
      title: tab.title || "",
      id: tab.id || 0,
      key: tab.index + 1,
      idx: tab.index,
      favIconUrl: tab.favIconUrl || "",
    };
  }
}

export class SearchableTab {
  title: string;
  id: number;
  key: number;
  idx: number;
  favIconUrl: string;
  url: string;

  constructor(
    title: string,
    id: number,
    key: number,
    idx: number,
    favIconUrl: string,
    url: string,
  ) {
    this.title = title;
    this.id = id;
    this.key = key;
    this.idx = idx;
    this.favIconUrl = favIconUrl;
    this.url = url;
  }

  static from(tab: browser.Tabs.Tab): SearchableTab {
    return {
      title: tab.title || "",
      id: tab.id || 0,
      key: tab.index + 1,
      idx: tab.index,
      favIconUrl: tab.favIconUrl || "",
      url: tab.url || "",
    };
  }
}
