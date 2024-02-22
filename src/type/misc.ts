import { Resource } from "./resource.ts";

export interface MenuServiceOption<T extends Resource> {
  context: Context;
  search: (content: string) => Promise<T[]>;
  buildElement: (element: T, callback: (idx: number) => void) => HTMLLIElement;
  goTo: (element: T) => Promise<void>;
  placeholder: string;
}

export enum Context {
  ContentScript,
  Popup,
}

export enum Appearance {
  Light = "light",
  Dark = "dark",
}
