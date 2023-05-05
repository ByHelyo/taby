export const handleMenu = function (menu, urls) {
  if (menu.isDisplayed()) {
    menu.display(false);
    return;
  }

  menu.display(true);
  menu.focusSearchInput();
  menu.resetSearchList();

  urls.forEach((url, idx) => {
    menu.addSearchList(idx + ". " + url.title);
  });
};
