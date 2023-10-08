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

  addSearchItems(tabs: Tab[]) {
    tabs.forEach((tab: Tab) => {
      this.addSearchItem(tab.index + 1, tab.title);
    });
  }

  addSearchItem(index: number, title: string) {
    this.searchList.appendChild(buildSearchItem(index, title));
  }

  clearSearchInput() {
    this.searchInput.value = "";
  }

  replaceClassSearchList(nth: number, className: string) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove(className);
    }

    const newSelectedTab = this.searchList.querySelector(
      `li:nth-of-type(${nth})`
    );

    newSelectedTab?.classList.add(className);
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
