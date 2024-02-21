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
