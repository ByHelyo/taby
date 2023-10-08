import Fuse from "fuse.js";
import {
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import { MenuService } from "../service/menuService.ts";
import browser from "webextension-polyfill";

export class Menu {
  selectedTab: Tab | null;
  tabs: Tab[];
  menuService: MenuService;
  display: boolean;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.display = false;
    this.menuService = new MenuService();
    this.menuService.onInput((e) => this.handleOnInput(e));
    this.menuService.onKeyDown((e) => this.handleOnKeyDown(e));
  }

  setTabs(tabs: Tab[]) {
    this.tabs = tabs;
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  setSelectedTab(tab: Tab | null) {
    this.selectedTab = tab;
  }

  isDisplayed(): boolean {
    return this.display;
  }

  openMenu(tabs: Tab[]) {
    this.setSelectedTab(null);

    this.setTabs(tabs);
    this.display = true;
    this.menuService.openMenu(tabs);
  }

  closeMenu() {
    this.menuService.displays(false);
    this.display = false;
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          const message: MessageFromScript = {
            type: MessageFromScriptType.REQUEST_SWITCH_TAB,
            tab: selectedTab,
          };

          browser.runtime.sendMessage(message);
          this.closeMenu(); /* Close menu */
        }
        break;
      case "Escape":
        this.closeMenu(); /* Close menu */
        break;
    }
  }

  handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;
    const options = {
      keys: ["title", "url", "index"],
    };

    if (searchInput === "") {
      this.setSelectedTab(this.tabs[0]);
      this.menuService.updateSearchList(this.tabs);
      return;
    }

    const fuse = new Fuse(this.tabs, options);

    const matched: Tab[] = fuse.search(searchInput).map((tab) => {
      return {
        url: tab.item.url,
        title: tab.item.title,
        id: tab.item.id,
        index: tab.item.index,
      };
    });

    if (matched.length !== 0) {
      this.setSelectedTab(matched[0]);
    } else {
      this.setSelectedTab(null);
    }

    this.menuService.updateSearchList(matched);
  }
}
