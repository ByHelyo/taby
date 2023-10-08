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

  getTabs(): Tab[] {
    return this.tabs;
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
    this.setTabs(tabs);
    this.setSelectedTab(this.getTabs()[0]);

    this.display = true;
    this.menuService.openMenu(tabs);
  }

  closeMenu() {
    this.menuService.displays(false);
    this.display = false;
  }

  moveUp() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getTabs().length;
    const nextIndex = (selectedTab.index - 1) % n;

    this.setSelectedTab(this.getTabs()[nextIndex]);
  }

  moveDown() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getTabs().length;
    const nextIndex = (selectedTab.index + 1) % n;

    this.setSelectedTab(this.getTabs()[nextIndex]);
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
      case "ArrowUp":
        this.moveUp();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
    }
  }

  handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;
    const options = {
      keys: ["title", "url", "index"],
    };

    if (searchInput === "") {
      this.setSelectedTab(this.getTabs()[0]);
      this.menuService.updateSearchList(this.getTabs());
      return;
    }

    const fuse = new Fuse(this.getTabs(), options);

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
