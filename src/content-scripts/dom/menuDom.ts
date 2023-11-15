import {
  buildMenu,
  buildSearch,
  buildSearchInput,
  buildSearchItem,
  buildSearchList,
} from "./build.ts";
import { Tab } from "../../type/misc.ts";

export class MenuDom {
  menu: HTMLDivElement;
  search: HTMLDivElement;
  searchInput: HTMLInputElement;
  searchList: HTMLUListElement;

  constructor() {
    this.searchList = buildSearchList();
    this.searchInput = buildSearchInput();
    this.search = buildSearch(this.searchInput);
    this.menu = buildMenu(this.search, this.searchList);
  }

  focusInput() {
    this.searchInput.focus();
  }

  displays(show: boolean) {
    show
      ? this.menu.classList.add("taby-display")
      : this.menu.classList.remove("taby-display");
  }

  clearList() {
    this.searchList.innerHTML = "";
  }

  addItems(tabs: Tab[], callback: (idx: number) => void) {
    tabs.forEach((tab: Tab) => {
      this.addItem(tab.key, tab.idx, tab.title, tab.favIconUrl, callback);
    });
  }

  addItem(
    key: number,
    idx: number,
    title: string,
    favIconUrl: string,
    callback: (idx: number) => void,
  ) {
    this.searchList.appendChild(
      buildSearchItem(key, idx, title, favIconUrl, callback),
    );
  }

  pushItem(
    key: number,
    idx: number,
    title: string,
    favIconUrl: string,
    callback: (idx: number) => void,
  ) {
    this.searchList.prepend(
      buildSearchItem(key, idx, title, favIconUrl, callback),
    );
  }

  clearInput() {
    this.searchInput.value = "";
  }

  /**
   * Removes the currently selected tab and selects the nth tab.
   *
   * @param nth The position of the tab to be selected
   */
  selectItem(nth: number) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(
      `li[class~="taby-${nth}"]`,
    );

    newSelectedTab?.classList.add("taby-active");
  }

  contains(elt: HTMLElement): boolean {
    return this.menu.contains(elt);
  }

  onInput(callback: (event: Event) => void) {
    this.searchInput.addEventListener("input", callback);
  }

  onKeyDown(callback: (event: KeyboardEvent) => void) {
    this.searchInput.addEventListener("keydown", callback);
  }

  removeItem(selector: string) {
    const tab = this.searchList.querySelector(selector);
    if (tab) {
      tab.remove();
    }
  }
}
