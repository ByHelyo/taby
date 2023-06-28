import { buildMenu } from "./dom/build.tsx";
import {
  clearSearchInput,
  contains,
  displays,
  focusSearchInput,
  isDisplayed,
} from "./dom/misc.tsx";
import { resetSearchList } from "./dom/delete.tsx";
import { addSearchList } from "./dom/add.tsx";
import {
  handleMenu,
  handleSearchBar,
  handleSearchItems,
} from "./handler/handler.tsx";
import {
  eventSearchOnInput,
  eventSearchOnKeyDown,
} from "./event/searchInput.tsx";

export class Menu {
  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.dom = buildMenu();
    eventSearchOnInput(this);
    eventSearchOnKeyDown(this);
  }

  focusSearchInput = focusSearchInput;
  isDisplayed = isDisplayed;
  displays = displays;
  resetSearchList = resetSearchList;
  addSearchList = addSearchList;
  handleMenu = handleMenu;
  contains = contains;
  handleSearchBar = handleSearchBar;
  handleSearchItems = handleSearchItems;
  clearSearchInput = clearSearchInput;
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
