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

  static from(tab: browser.Tabs.Tab, idx: number): Tab {
    return {
      title: tab.title || "",
      id: tab.index,
      key: tab.index + 1,
      idx: idx,
      favIconUrl: tab.favIconUrl || "",
    };
  }
}
