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

  moveWindowDown(
    tab1: Tab,
    tab2: Tab,
    callback: (internalIndex: number) => void,
  ) {
    this.dom.removeItem(`li[class~="taby-${tab1.internalIndex}"]`);
    this.dom.addSearchItem(
      tab2.key,
      tab2.internalIndex,
      tab2.title,
      tab2.favIconUrl,
      callback,
    );
  }

  moveWindowUp(
    tab1: Tab,
    tab2: Tab,
    callback: (internalIndex: number) => void,
  ) {
    this.dom.removeItem(`li[class~="taby-${tab2.internalIndex}"]`);
    this.dom.pushSearchItem(
      tab1.key,
      tab1.internalIndex,
      tab1.title,
      tab1.favIconUrl,
      callback,
    );
  }
}
