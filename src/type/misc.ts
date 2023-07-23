export enum MessageFromScriptType {
  REQUEST_SWITCH_TAB,
}

export interface MessageFromScript {
  type: MessageFromScriptType;
  tab: Tab;
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
  url: string;
  id: number;
  index: number;
}
