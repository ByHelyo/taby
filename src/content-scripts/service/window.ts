const SEARCH_INPUT_SIZE: number = 60;
const PADDINGS_SEARCH_LIST: number = 16;
const SEARCH_ITEM_SIZE: number = 40;

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

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  setSize(num: number) {
    this.size = num;
  }

  getCapacity() {
    return this.capacity;
  }

  isValid(idx: number) {
    return idx < this.start || idx >= this.end;
  }

  moveEnd() {
    this.start = this.size - this.capacity;
    this.end = this.size;
  }

  moveUp() {
    --this.start;
    --this.end;
  }

  moveStart() {
    this.start = 0;
    this.end = this.capacity;
  }

  moveDown() {
    ++this.start;
    ++this.end;
  }
}
