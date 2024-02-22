import { Tab } from "./tab.ts";

export enum MessageFromScriptType {
  REQUEST_SWITCH_TAB,
  REQUEST_UPDATE_CURRENT_TAB,
  REQUEST_SEARCH_OPEN_TABS,
  REQUEST_SEARCH_BOOKMARKS,
  REQUEST_SEARCH_HISTORY,
}

export interface MessageFromScript<T> {
  type: MessageFromScriptType;
  element?: T;
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
