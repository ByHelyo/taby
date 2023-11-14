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

export interface Tab {
  title: string;
  id: number;
  key: number;
  internalIndex: number;
  favIconUrl: string;
}

export interface SearchableTab {
  title: string;
  id: number;
  url: string;
  key: number;
  favIconUrl: string;
}
