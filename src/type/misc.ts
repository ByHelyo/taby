import { Tab } from "./tab.ts";

export interface Id {
  id: number;
}

export interface Idx {
  idx: number;
}

export interface MenuServiceOption<T extends Idx> {
  context: Context;
  search: (content: string) => Promise<T[]>;
  buildElement: (tab: T, callback: (idx: number) => void) => HTMLLIElement;
}

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
  REQUEST_SEARCH_OPEN_TABS,
  REQUEST_SEARCH_BOOKMARKS,
}

export interface MessageFromScript<T> {
  type: MessageFromScriptType;
  tab?: T;
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
