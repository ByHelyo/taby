import { TTab } from "./tab.tsx";

export enum EMessageFromScriptType {
  REQUEST_SWITCH_TAB,
  REQUEST_UPDATE_CURRENT_TAB,
  REQUEST_SEARCH_OPEN_TABS,
  REQUEST_SEARCH_BOOKMARKS,
  REQUEST_SEARCH_HISTORY,
}

export interface TMessageFromScript {
  type: EMessageFromScriptType;
  element?: TTab;
  search?: string;
  newTab?: boolean;
}
