import {
  buildMenu,
  buildRoot,
  buildSearch,
  buildSearchInput,
  buildSearchList,
} from "./build.ts";
import { enter, leave } from "../misc/animation.ts";
import { Tab } from "../../type/tab.ts";
import { MenuService } from "../service/menuService.ts";

export class MenuDom {
  private readonly menuService: MenuService;
  private readonly root: HTMLDivElement;
  private readonly menu: HTMLDivElement;
  private readonly search: HTMLDivElement;
  private readonly searchInput: HTMLInputElement;
  private readonly searchList: HTMLUListElement;

  constructor(menuService: MenuService) {
    this.menuService = menuService;
    this.searchList = buildSearchList();
    this.searchInput = buildSearchInput();
    this.search = buildSearch(this.searchInput);
    this.menu = buildMenu(this.search, this.searchList);
    this.root = buildRoot(this.menu);
  }

  getRoot() {
    return this.root;
  }

  focusInput() {
    this.searchInput.focus();
  }

  async displays(show: boolean) {
    if (show) {
      await enter(this.menu, "fade");
    } else {
      await leave(this.menu, "fade");
    }
  }

  clearList() {
    this.searchList.innerHTML = "";
  }

  addItems(tabs: Tab[], callback: (id: number) => void) {
    tabs.forEach((tab: Tab) => {
      this.addItem(tab, callback);
    });
  }

  addItem(tab: Tab, callback: (id: number) => void) {
    this.searchList.appendChild(
      this.menuService.getOptions().buildElement(tab, callback),
    );
  }

  clearInput() {
    this.searchInput.value = "";
  }

  /**
   * Removes the currently selected tab and selects the id tab.
   *
   * @param id The id of the tab to be selected
   */
  selectItem(id: number) {
    const previousSelectedTab = this.searchList.querySelector(".taby-active");
    if (previousSelectedTab) {
      previousSelectedTab.classList.remove("taby-active");
    }

    const newSelectedTab = this.searchList.querySelector(
      `li[class~="taby-${id}"]`,
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

  removeItem(id: number) {
    const tab = this.searchList.querySelector(`li[class~="taby-${id}"]`);
    if (tab) {
      tab.remove();
    }
  }

  pushItem(tab: Tab, callback: (id: number) => void) {
    this.searchList.prepend(
      this.menuService.getOptions().buildElement(tab, callback),
    );
  }

  hideResults() {
    this.searchList.classList.add("taby-searchListEmpty");
  }

  displayResults() {
    this.searchList.classList.remove("taby-searchListEmpty");
  }
}
