import browser from "webextension-polyfill";

export enum MessageFromScriptType {
  REQUEST_SWITCH_TAB,
  REQUEST_SEARCH_TAB,
}

export interface MessageFromScript {
  type: MessageFromScriptType;
  tab?: Tab;
  search?: string;
}

export enum MessageFromBackgroundType {
  TOGGLE_MENU,
  USER_SWITCHES_TAB,
}

export interface MessageFromBackground {
  type: MessageFromBackgroundType;
  tabs?: Tab[];
}

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
