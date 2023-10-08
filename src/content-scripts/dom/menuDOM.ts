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
      this.addSearchItem(tab.index, tab.title);
    });
  }

  addSearchItem(index: number, title: string) {
    this.searchList.appendChild(buildSearchItem(index, title));
  }

  clearSearchInput() {
    this.searchInput.value = "";
  }

  selectSearchList(nth: number) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(
      `li:nth-of-type(${nth})`
    );

    newSelectedTab?.classList.add("taby-active");
  }

  selectFirstSearchList() {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(`li:nth-of-type(1)`);

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
