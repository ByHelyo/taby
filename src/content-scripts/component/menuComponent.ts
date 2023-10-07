import { MenuDOM } from "../dom/menuDOM.ts";
import { Tab } from "../../type/misc.ts";

export class MenuComponent {
  dom: MenuDOM;

  constructor() {
    this.dom = new MenuDOM();
  }

  openMenu(tabs: Tab[]) {
    this.dom.displays(true);
    this.dom.clearSearchInput();
    this.dom.focusSearchInput();
    this.dom.clearSearchList();
    this.dom.addSearchItems(tabs);
  }

  updateSearchList(tabs: Tab[]) {
    this.dom.clearSearchList();
    this.dom.addSearchItems(tabs);
  }

  displays(show: boolean) {
    this.dom.displays(show);
  }

  contains(elt: HTMLElement): boolean {
    return this.dom.contains(elt);
  }

  onInput(callback: (event: Event) => void) {
    this.dom.onInput(callback);
  }

  onKeyDown(callback: (event: KeyboardEvent) => void) {
    this.dom.onKeyDown(callback);
  }
}
