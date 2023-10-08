import { MenuDOM } from "../dom/menuDOM.ts";
import { Tab } from "../../type/misc.ts";

export class MenuService {
  dom: MenuDOM;

  constructor() {
    this.dom = new MenuDOM();
  }

  openMenu() {
    this.dom.displays(true);
    this.dom.clearSearchInput();
    this.dom.focusSearchInput();
  }

  setSearchList(tabs: Tab[]) {
    this.dom.clearSearchList();
    this.dom.addSearchItems(tabs);
  }

  selectSearchList(tab: Tab) {
    this.dom.selectItemSearchList(tab.internalIndex);
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
