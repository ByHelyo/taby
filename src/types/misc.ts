export enum MessageFromScriptType {
  ASK_TABS = "ASK_TABS",
  CHANGE_TAB = "CHANGE_TAB",
}

export interface MessageFromScript {
  type: MessageFromScriptType;
  tab: any;
}

export enum MessageFromBackgroundType {
  TOGGLE_MENU = "TOGGLE_MENU",
}

export interface MessageFromBackground {
  type: MessageFromBackgroundType;
  tabs: any;
}
