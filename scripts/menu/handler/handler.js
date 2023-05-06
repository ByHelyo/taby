export const handleMenu = function (urls) {
  if (this.isDisplayed()) {
    this.display(false);
    return;
  }

  this.display(true);
  this.focusSearchInput();
  this.resetSearchList();

  urls.forEach((url, idx) => {
    this.addSearchList(idx + ". " + url.title);
  });
};
