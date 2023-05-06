import { buildMenu } from "./dom/build";
import { display, focusSearchInput, isDisplayed } from "./dom/misc";
import { resetSearchList } from "./dom/delete";
import { addSearchList } from "./dom/add";
import { handleMenu } from "./handler/handler";

export function Menu() {
  this.dom = buildMenu();

  this.focusSearchInput = focusSearchInput;
  this.isDisplayed = isDisplayed;
  this.display = display;
  this.resetSearchList = resetSearchList;
  this.addSearchList = addSearchList;
  this.handleMenu = handleMenu;
}
