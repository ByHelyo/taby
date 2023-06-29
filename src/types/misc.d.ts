export enum MessageFromScriptType {
  ASK_TABS,
  CHANGE_TAB,
}

export interface MessageFromScript {
  type: MessageFromScriptType;
  tab: any;
}

export enum MessageFromBackgroundType {
  TOGGLE_MENU,
}

export interface MessageFromBackground {
  type: MessageFromBackgroundType;
}
