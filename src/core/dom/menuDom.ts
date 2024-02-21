import {
  buildMenu,
  buildRoot,
  buildSearch,
  buildSearchInput,
  buildSearchList,
} from "./build.ts";
import { enter, leave } from "../misc/animation.ts";
import { MenuService } from "../service/menuService.ts";
import { Idx } from "../../type/misc.ts";

export class MenuDom<T extends Idx> {
  private readonly menuService: MenuService<T>;
  private readonly root: HTMLDivElement;
  private readonly menu: HTMLDivElement;
  private readonly search: HTMLDivElement;
  private readonly searchInput: HTMLInputElement;
  private readonly searchList: HTMLUListElement;

  constructor(menuService: MenuService<T>) {
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

  addItems(elements: T[], callback: (idx: number) => void) {
    elements.forEach((element: T) => {
      this.addItem(element, callback);
    });
  }

  addItem(element: T, callback: (idx: number) => void) {
    this.searchList.appendChild(
      this.menuService.getOptions().buildElement(element, callback),
    );
  }

  clearInput() {
    this.searchInput.value = "";
  }

  /**
   * Removes the currently selected element and selects the id element.
   *
   * @param id The id of the element to be selected
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

  removeItem(idx: number) {
    const element = this.searchList.querySelector(`li[class~="taby-${idx}"]`);
    if (element) {
      element.remove();
    }
  }

  pushItem(element: T, callback: (idx: number) => void) {
    this.searchList.prepend(
      this.menuService.getOptions().buildElement(element, callback),
    );
  }

  hideResults() {
    this.searchList.classList.add("taby-searchListEmpty");
  }

  displayResults() {
    this.searchList.classList.remove("taby-searchListEmpty");
  }
}
