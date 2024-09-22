export const enum ESelectedGroup {
  Tab,
  Bookmarks,
  History,
  Settings,
}

export enum EStorage {
  Appearance = "appearance",
  PopupWindow = "popup_window",
  PositionInline = "position_inline",
  PositionBlock = "position_block",
  Scroll = "scroll",
  CommandPaletteWidth = "command_palette_width",
}

export enum EPopupWindow {
  Fixed = "fixed",
  UnFixed = "unfixed",
}

export enum EAppearance {
  Light = "light",
  Dark = "dark",
}

export enum EScroll {
  Default = "default",
  Reversed = "reversed",
}

export enum EContext {
  ContentScript,
  Popup,
}
