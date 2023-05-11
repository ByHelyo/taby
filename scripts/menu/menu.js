import { buildMenu } from "./dom/build";
import { contains, displays, focusSearchInput, isDisplayed } from "./dom/misc";
import { resetSearchList } from "./dom/delete";
import { addSearchList } from "./dom/add";
import { handleMenu } from "./handler/handler";

export class Menu {
  constructor() {
    this.dom = buildMenu();
    this.setEvent();
  };

  focusSearchInput = focusSearchInput;
  isDisplayed = isDisplayed;
  displays = displays;
  resetSearchList = resetSearchList;
  addSearchList = addSearchList;
  handleMenu = handleMenu;
  contains = contains;
}

Menu.prototype.setEvent = function() {
  this.dom.searchInput.addEventListener("input", function () {
  });
}