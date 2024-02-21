import { Context } from "../../type/misc.ts";
import { MenuService } from "./menuService.ts";

const SEARCH_INPUT_SIZE: number = 55,
  BORDER_SIZE: number = 2,
  PADDINGS_SEARCH_LIST: number = 16,
  SEARCH_ITEM_SIZE: number = 33,
  NAV_POPUP: number = 30;

export enum Action {
  MovedUp,
  MovedDown,
  MovedToStart,
  MovedToEnd,
  Unchanged,
}

export interface WindowResult {
  action: Action;
  end: number;
  next: number;
  start: number;
}

export class WindowService {
  private start: number;
  private end: number;
  private capacity: number;
  private size: number;
  private readonly menuService: MenuService;

  constructor(menuService: MenuService) {
    this.menuService = menuService;
    this.capacity = this.computeCapacity();
    this.start = 0;
    this.end = this.capacity;
    this.size = 0;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  resize() {
    this.capacity = this.computeCapacity();
    this.start = 0;
    this.end = this.capacity;
  }

  computeCapacity() {
    const window_size =
      this.menuService.getContext() === Context.ContentScript
        ? window.innerHeight * 0.75
        : 600 - NAV_POPUP;

    const menu_size =
      window_size - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST - BORDER_SIZE;
    return Math.floor(menu_size / SEARCH_ITEM_SIZE);
  }

  setSize(num: number) {
    this.size = num;
  }

  getCapacity() {
    return this.capacity;
  }

  isValid(idx: number) {
    return idx >= this.start && idx < this.end;
  }

  moveUp(idx: number): WindowResult {
    const next = (idx - 1 + this.size) % this.size;

    if (!this.isValid(next)) {
      if (next == this.size - 1) {
        this.moveEnd();
        return {
          action: Action.MovedToEnd,
          start: this.start,
          end: this.end,
          next,
        };
      } else {
        --this.start;
        --this.end;
        return {
          action: Action.MovedUp,
          start: this.start,
          end: this.end,
          next,
        };
      }
    }

    return {
      action: Action.Unchanged,
      start: this.start,
      end: this.end,
      next,
    };
  }

  moveDown(idx: number): WindowResult {
    const next = (idx + 1) % this.size;

    if (!this.isValid(next)) {
      if (next == 0) {
        this.moveStart();
        return {
          action: Action.MovedToStart,
          start: this.start,
          end: this.end,
          next: next,
        };
      } else {
        const ret: WindowResult = {
          action: Action.MovedDown,
          start: this.start,
          end: this.end,
          next: next,
        };
        ++this.start;
        ++this.end;
        return ret;
      }
    }

    return {
      action: Action.Unchanged,
      start: this.start,
      end: this.end,
      next: next,
    };
  }

  moveEnd() {
    this.start = this.size - this.capacity;
    this.end = this.size;
  }

  moveStart() {
    this.start = 0;
    this.end = this.capacity;
  }
}
