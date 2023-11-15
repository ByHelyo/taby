const SEARCH_INPUT_SIZE: number = 60;
const PADDINGS_SEARCH_LIST: number = 16;
const SEARCH_ITEM_SIZE: number = 40;

export enum Move {
  MovedUp,
  MovedDown,
  MovedToStart,
  MovedToEnd,
  Unchanged,
}

export interface WindowResult {
  move: Move;
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
    const menu_max_size =
      window.innerHeight * 0.7 - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST;
    this.capacity = Math.floor(menu_max_size / SEARCH_ITEM_SIZE);
    this.start = 0;
    this.end = this.capacity;
    this.size = 0;
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
          move: Move.MovedToEnd,
          start: this.start,
          end: this.end,
          next: next,
        };
      } else {
        --this.start;
        --this.end;
        return {
          move: Move.MovedUp,
          start: this.start,
          end: this.end,
          next: next,
        };
      }
    }

    return {
      move: Move.Unchanged,
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
          move: Move.MovedToStart,
          start: this.start,
          end: this.end,
          next: next,
        };
      } else {
        const ret: WindowResult = {
          move: Move.MovedDown,
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
      move: Move.Unchanged,
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
