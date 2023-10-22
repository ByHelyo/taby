import { MenuDom } from "../dom/menuDom.ts";
import { Tab } from "../../type/misc.ts";

export class MenuRepository {
  dom: MenuDom;

  constructor() {
    this.dom = new MenuDom();
  }

  openMenu() {
    this.dom.displays(true);
    this.dom.clearSearchInput();
    this.dom.focusSearchInput();
  }

  setSearchList(tabs: Tab[], callback: (internalIndex: number) => void) {
    this.dom.clearSearchList();
    this.dom.addSearchItems(tabs, callback);
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
