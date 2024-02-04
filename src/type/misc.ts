import { Tab } from "./tab.ts";

export enum Context {
  ContentScript,
  Popup,
}

export enum Appearance {
  Light = "light",
  Dark = "dark",
}

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
