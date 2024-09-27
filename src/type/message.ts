import { TTab } from "./tab.tsx";

export enum EMessageFromScriptType {
  REQUEST_SWITCH_TAB,
  REQUEST_UPDATE_CURRENT_TAB,
  REQUEST_SEARCH_OPEN_TABS,
  REQUEST_SEARCH_BOOKMARKS,
  REQUEST_SEARCH_HISTORY,
}

export enum EMessageFromBackgroundType {
  TOGGLE_MENU,
  USER_SWITCHES_TAB,
}

export interface TMessageFromBackground {
  type: EMessageFromBackgroundType;
  tabs?: TTab[];
}

export interface TMessageFromScript {
  type: EMessageFromScriptType;
  element?: TTab;
  search?: string;
}
