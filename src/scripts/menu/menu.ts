import Fuse from "fuse.js";
import {
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../types/misc.ts";
import { MenuComponent } from "./component/menuComponent.ts";

export class Menu {
  selectedTab: Tab | null;
  tabs: Tab[];
  menuComponent: MenuComponent;
  display: boolean;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.display = false;
    this.menuComponent = new MenuComponent();
    this.menuComponent.onInput((e) => this.handleOnInput(e));
    this.menuComponent.onKeyDown((e) => this.handleOnKeyDown(e));
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
    this.menuComponent.openMenu(tabs);
  }

  closeMenu() {
    this.menuComponent.displays(false);
    this.display = false;
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          const message: MessageFromScript = {
            type: MessageFromScriptType.CHANGE_TAB,
            tab: selectedTab,
          };

          chrome.runtime.sendMessage(message);
        }
        this.closeMenu(); /* Close menu */
        break;
      case "Escape":
        this.closeMenu(); /* Close menu */
        break;
    }
  }

  handleOnInput(e: Event) {
    this.handleSearchBar((<HTMLInputElement>e.target).value);
  }

  handleSearchBar(searchInput: string) {
    const options = {
      keys: ["title", "url", "index"],
    };

    if (searchInput === "") {
      this.setSelectedTab(this.tabs[0]);
      this.menuComponent.updateSearchList(this.tabs);
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

    this.menuComponent.updateSearchList(matched);
  }
}
