export interface Url {
  id: number;
  url: string;
}

export interface Idx {
  idx: number;
}

export interface MenuServiceOption<T extends Idx> {
  context: Context;
  search: (content: string) => Promise<T[]>;
  buildElement: (element: T, callback: (idx: number) => void) => HTMLLIElement;
  goTo: (element: T) => Promise<void>;
}

export enum Context {
  ContentScript,
  Popup,
}

export enum Appearance {
  Light = "light",
  Dark = "dark",
}
