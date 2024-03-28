import { Context, Storage } from "../../type/misc.ts";
import { MenuService } from "../service/menuService.ts";
import { Resource } from "../../type/resource.ts";
import { MenuUi } from "./menuUi.ts";
import { MenuDom } from "../dom/menuDom.ts";
import browser from "webextension-polyfill";

const SEARCH_INPUT_SIZE: number = 55,
  BORDER_SIZE: number = 2,
  PADDINGS_SEARCH_LIST: number = 16,
  SEARCH_ITEM_SIZE: number = 33,
  NAV_POPUP: number = 30;

export class WindowUi<T extends Resource> {
  private start: number;
  private end: number;
  private capacity: number;
  private readonly menuService: MenuService<T>;
  private readonly menuUi: MenuUi<T>;
  private readonly dom: MenuDom<T>;

  constructor(
    menuService: MenuService<T>,
    menuUi: MenuUi<T>,
    menuDom: MenuDom<T>,
  ) {
    this.dom = menuDom;
    this.menuUi = menuUi;
    this.capacity = -1;
    this.end = -1;
    this.menuService = menuService;
    this.start = 0;

    this.handleOnWheel();
  }

  async initialize() {
    this.capacity = await this.computeCapacity();
    this.end = this.capacity;
  }

  async resize() {
    this.capacity = await this.computeCapacity();
    await this.menuUi.setElements();
  }

  async computeCapacity() {
    const storage = await browser.storage.local.get([Storage.PositionBlock]);
    const position_block = 1 - Number(storage[Storage.PositionBlock]) * 0.01;

    const window_size =
      this.menuService.getContext() === Context.ContentScript
        ? window.innerHeight * position_block
        : 600 - NAV_POPUP;

    const menu_size =
      window_size - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST - BORDER_SIZE;
    const capacity = Math.floor(menu_size / SEARCH_ITEM_SIZE);

    return this.menuService.getContext() == Context.ContentScript
      ? Math.min(10, Math.max(capacity - 1, 0))
      : capacity;
  }

  moveUp() {
    const selectedTab = this.menuService.getSelectedElement();
    if (!selectedTab) {
      return;
    }

    const size = this.menuService.getElements().length;

    const next = (selectedTab.idx - 1 + size) % size;
    if (next === this.start - 1) {
      this.start -= 1;
      this.end -= 1;
    } else if (next == size - 1) {
      this.start = Math.max(size - this.capacity, 0);
      this.end = size;
    }

    this.dom.clearList();
    this.dom.addItems(
      this.menuService.getElements().slice(this.start, this.end),
      async (idx: number) => {
        await this.menuUi.handleOnClick(idx);
      },
    );

    this.menuService.setSelectedElement(this.menuService.getElements()[next]);
  }

  moveDown() {
    const selectedTab = this.menuService.getSelectedElement();

    if (!selectedTab) {
      return;
    }

    const size = this.menuService.getElements().length;

    const next = (selectedTab.idx + 1) % size;

    if (next === this.end) {
      this.start += 1;
      this.end += 1;
    } else if (next == 0) {
      this.start = 0;
      this.end = Math.min(size, this.capacity);
    }

    this.dom.clearList();
    this.dom.addItems(
      this.menuService.getElements().slice(this.start, this.end),
      async (idx: number) => {
        await this.menuUi.handleOnClick(idx);
      },
    );

    this.menuService.setSelectedElement(this.menuService.getElements()[next]);
  }

  setElements() {
    const elements = this.menuService.getElements();
    this.start = 0;
    this.end = Math.min(elements.length, this.capacity);

    this.dom.addItems(
      elements.slice(this.start, this.end),
      async (idx: number) => {
        await this.menuUi.handleOnClick(idx);
      },
    );
  }

  handleOnWheel() {
    this.dom.getDom().addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.moveUp();
      } else if (e.deltaY > 0) {
        this.moveDown();
      }
    });
  }
}
