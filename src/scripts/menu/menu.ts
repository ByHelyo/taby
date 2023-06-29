import { buildMenu, buildSearchItem } from "./dom/build.ts";
import Fuse from "fuse.js";
import {
  eventSearchOnInput,
  eventSearchOnKeyDown,
} from "./event/searchInput.ts";

export class Menu {
  selectedTab: any;
  tabs: any;
  dom: any;
  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.dom = buildMenu();
    eventSearchOnInput(this);
    eventSearchOnKeyDown(this);
  }

  focusSearchInput = function () {
    const searchInput = this.dom.searchInput;

    searchInput.focus();
  };
  isDisplayed = function () {
    return this.dom.menu.classList.contains("taby-display");
  };
  displays = function (show) {
    if (show) {
      this.dom.menu.classList.add("taby-display");
    } else {
      this.dom.menu.classList.remove("taby-display");
    }
  };
  resetSearchList = function () {
    const searchList = this.dom.searchList;

    searchList.innerHTML = "";
  };
  addSearchList = function (index: string, title: string, url: string) {
    const searchList = this.dom.searchList;

    searchList.appendChild(buildSearchItem(index, title, url));
  };

  handleMenu = function (tabs) {
    this.setSelectedTab(null); /* Clear selected tab */

    if (this.isDisplayed()) {
      this.displays(false);
      return;
    }

    this.setTabs(tabs);
    this.displays(true);
    this.clearSearchInput();
    this.focusSearchInput();
    this.handleSearchItems(tabs);
  };
  contains = function (domElement) {
    return this.dom.menu.contains(domElement);
  };
  handleSearchBar = function (searchInput) {
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

    console.log(this.getSelectedTab());

    this.handleSearchItems(matched);
  };
  handleSearchItems = function (tabs) {
    this.resetSearchList();

    tabs.forEach((tab) => {
      this.addSearchList(tab.index, tab.title, tab.url);
    });
  };
  clearSearchInput = function () {
    const searchInput = this.dom.searchInput;

    searchInput.value = "";
  };
}

Menu.prototype.setTabs = function (tabs) {
  this.tabs = tabs;
};

Menu.prototype.getSelectedTab = function () {
  return this.selectedTab;
};

Menu.prototype.setSelectedTab = function (selectedTab) {
  this.selectedTab = selectedTab;
};
