export enum MessageFromScriptType {
  CHANGE_TAB,
}

export interface MessageFromScript {
  type: MessageFromScriptType;
  tab: Tab;
}

export enum MessageFromBackgroundType {
  TOGGLE_MENU,
}

export interface MessageFromBackground {
  type: MessageFromBackgroundType;
  tabs: Tab[];
}

export interface Tab {
  title: string;
  url: string;
  id: number;
  index: number;
}
