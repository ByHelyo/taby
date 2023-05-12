import { buildMenu } from "./dom/build";
import {
  clearSearchInput,
  contains,
  displays,
  focusSearchInput,
  isDisplayed,
} from "./dom/misc";
import { resetSearchList } from "./dom/delete";
import { addSearchList } from "./dom/add";
import {
  handleMenu,
  handleSearchBar,
  handleSearchItems,
} from "./handler/handler";
import { eventSearchOnInput, eventSearchOnKeyUp } from "./event/searchInput";

export class Menu {
  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.dom = buildMenu();
    eventSearchOnInput(this);
    eventSearchOnKeyUp(this);
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
