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
  displayedTabs: Tab[];
  menuService: MenuService;
  display: boolean;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.displayedTabs = [];
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

  setDisplayedTabs(tabs: Tab[]) {
    this.displayedTabs = tabs;
    this.menuService.setSearchList(tabs, (internalIndex: number) =>
      this.handleOnClick(internalIndex),
    );
  }

  getDisplayedTabs(): Tab[] {
    return this.displayedTabs;
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  setSelectedTab(tab: Tab | null) {
    this.selectedTab = tab;
    if (tab) {
      this.menuService.selectSearchList(tab);
    }
  }

  isDisplayed(): boolean {
    return this.display;
  }

  openMenu() {
    this.display = true;
    this.menuService.openMenu();
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

    const n = this.getDisplayedTabs().length;
    const nextIndex = (selectedTab.internalIndex - 1 + n) % n;

    this.setSelectedTab(this.getDisplayedTabs()[nextIndex]);
  }

  moveDown() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getDisplayedTabs().length;
    const nextIndex = (selectedTab.internalIndex + 1) % n;

    this.setSelectedTab(this.getDisplayedTabs()[nextIndex]);
  }

  goToTab(tab: Tab) {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SWITCH_TAB,
      tab: tab,
    };

    browser.runtime.sendMessage(message);
    this.closeMenu(); /* Close menu */
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          this.goToTab(selectedTab);
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
      keys: ["title", "url", "key"],
    };

    if (searchInput === "") {
      this.setDisplayedTabs(this.getTabs());
      this.setSelectedTab(this.getTabs()[0]);
      return;
    }

    const fuse = new Fuse(this.getTabs(), options);

    const matched: Tab[] = fuse.search(searchInput).map((tab, ind) => {
      return {
        url: tab.item.url,
        title: tab.item.title,
        id: tab.item.id,
        key: tab.item.key,
        internalIndex: ind,
      };
    });

    this.setDisplayedTabs(matched);

    if (matched.length > 0) {
      this.setSelectedTab(matched[0]);
    } else {
      this.setSelectedTab(null);
    }
  }

  handleOnClick(internalIndex: number) {
    const selectedTab = this.getSelectedTab();
    if (
      selectedTab &&
      this.getSelectedTab() === this.getDisplayedTabs()[internalIndex]
    ) {
      this.goToTab(selectedTab);
    }
    this.setSelectedTab(this.getDisplayedTabs()[internalIndex]);
  }
}
