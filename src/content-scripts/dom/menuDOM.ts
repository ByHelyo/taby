import {
  buildMenu,
  buildSearch,
  buildSearchInput,
  buildSearchItem,
  buildSearchList,
} from "./build.ts";
import { Tab } from "../../type/misc.ts";

export class MenuDOM {
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

  focusSearchInput() {
    this.searchInput.focus();
  }

  displays(show: boolean) {
    show
      ? this.menu.classList.add("taby-display")
      : this.menu.classList.remove("taby-display");
  }

  clearSearchList() {
    this.searchList.innerHTML = "";
  }

  addSearchItems(tabs: Tab[], callback: (internalIndex: number) => void) {
    tabs.forEach((tab: Tab) => {
      this.addSearchItem(tab.key, tab.internalIndex, tab.title, callback);
    });
  }

  addSearchItem(
    key: number,
    internalIndex: number,
    title: string,
    callback: (internalIndex: number) => void,
  ) {
    this.searchList.appendChild(
      buildSearchItem(key, internalIndex, title, callback),
    );
  }

  clearSearchInput() {
    this.searchInput.value = "";
  }

  selectItemSearchList(nth: number) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(
      `li:nth-of-type(${nth + 1})`,
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
}
