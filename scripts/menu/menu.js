import { buildMenu } from "./dom/build";
import { contains, displays, focusSearchInput, isDisplayed } from "./dom/misc";
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
    this.urls = [];
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
}

Menu.prototype.setUrls = function (urls) {
  this.urls = urls;
};
