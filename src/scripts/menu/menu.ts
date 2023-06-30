import Fuse from "fuse.js";
import { MenuDOM } from "./dom/menuDOM";

export class Menu {
  selectedTab: any;
  tabs: any;
  dom: MenuDOM;
  display: boolean;
  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.display = false;
    this.dom = new MenuDOM();
    this.dom.onInput(() => this.handleSearchBar(this.dom.searchInput.value));
    this.dom.onKeyDown((e) => {
      const selectedTab = this.getSelectedTab();

      switch (e.key) {
        case "Enter":
          if (selectedTab !== null) {
            chrome.runtime.sendMessage({
              type: "CHANGE_TAB",
              tab: selectedTab,
            });
          }
          this.handleMenu(); /* Close menu */
          break;
        case "Escape":
          this.handleMenu(); /* Close menu */
          break;
      }
    });
  }

  handleMenu(tabs) {
    this.setSelectedTab(null); /* Clear selected tab */

    if (this.display) {
      this.dom.displays(false);
      this.display = !this.display;
      return;
    }

    this.setTabs(tabs);
    this.dom.displays(true);
    this.dom.clearSearchInput();
    this.dom.focusSearchInput();
    this.handleSearchItems(tabs);

    this.display = !this.display;
  }

  handleSearchBar(searchInput: string) {
    const options = {
      keys: ["title", "url", "index"],
    };

    if (searchInput === "") {
      this.setSelectedTab(this.tabs[0]);
      this.handleSearchItems(this.tabs);
      return;
    }

    const fuse = new Fuse(this.tabs, options);

    const matched = fuse.search(searchInput).map((tab) => {
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

    this.handleSearchItems(matched);
  }
  handleSearchItems(tabs) {
    this.dom.resetSearchList();

    tabs.forEach((tab) => {
      this.dom.addSearchList(tab.index, tab.title, tab.url);
    });
  }

  setTabs(tabs: any) {
    this.tabs = tabs;
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  setSelectedTab(tab) {
    this.selectedTab = tab;
  }
}
