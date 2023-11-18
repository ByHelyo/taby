const SEARCH_INPUT_SIZE: number = 60;
const PADDINGS_SEARCH_LIST: number = 16;
const SEARCH_ITEM_SIZE: number = 40;

export enum Action {
  MovedUp,
  MovedDown,
  MovedToStart,
  MovedToEnd,
  Unchanged,
}

export interface WindowResult {
  action: Action;
  start: number;
  end: number;
  next: number;
}

export class WindowService {
  start: number;
  end: number;
  capacity: number;
  size: number;

  constructor() {
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
    const menu_size =
      window.innerHeight * 0.7 - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST;
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
          next: next,
        };
      } else {
        --this.start;
        --this.end;
        return {
          action: Action.MovedUp,
          start: this.start,
          end: this.end,
          next: next,
        };
      }
    }

    return {
      action: Action.Unchanged,
      start: this.start,
      end: this.end,
      next: next,
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
