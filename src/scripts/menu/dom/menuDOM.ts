import {
  buildMenu,
  buildSearch,
  buildSearchInput,
  buildSearchItem,
  buildSearchList,
} from "./build";

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
    if (show) {
      this.menu.classList.add("taby-display");
    } else {
      this.menu.classList.remove("taby-display");
    }
  }

  resetSearchList() {
    this.searchList.innerHTML = "";
  }

  addSearchList(index: string, title: string, url: string) {
    this.searchList.appendChild(buildSearchItem(index, title, url));
  }

  clearSearchInput() {
    this.searchInput.value = "";
  }

  contains(elt: HTMLElement): boolean {
    return this.menu.contains(elt);
  }

  onInput(callback: () => void) {
    this.searchInput.addEventListener("input", callback);
  }

  onKeyDown(callback: (event: KeyboardEvent) => void) {
    this.searchInput.addEventListener("keydown", callback);
  }
}
