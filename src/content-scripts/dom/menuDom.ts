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

  async displays(show: boolean) {
    if (show) {
      this.menu.classList.remove("taby-hidden");
    } else {
      this.menu.classList.add("taby-hidden");
    }
  }

  clearList() {
    this.searchList.innerHTML = "";
  }

  addItems(tabs: Tab[], callback: (idx: number) => void) {
    tabs.forEach((tab: Tab) => {
      this.addItem(tab, callback);
    });
  }

  addItem(tab: Tab, callback: (idx: number) => void) {
    this.searchList.appendChild(
      buildSearchItem(tab.key, tab.idx, tab.title, tab.favIconUrl, callback),
    );
  }

  clearInput() {
    this.searchInput.value = "";
  }

  /**
   * Removes the currently selected tab and selects the idx tab.
   *
   * @param idx The idx of the tab to be selected
   */
  selectItem(idx: number) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(
      `li[class~="taby-${idx}"]`,
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

  removeItem(idx: number) {
    const tab = this.searchList.querySelector(`li[class~="taby-${idx}"]`);
    if (tab) {
      tab.remove();
    }
  }

  pushItem(tab: Tab, callback: (idx: number) => void) {
    this.searchList.prepend(
      buildSearchItem(tab.key, tab.idx, tab.title, tab.favIconUrl, callback),
    );
  }

  hideResults() {
    this.searchList.classList.add("taby-searchListEmpty");
  }

  displayResults() {
    this.searchList.classList.remove("taby-searchListEmpty");
  }
}
