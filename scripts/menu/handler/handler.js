export const handleMenu = function (urls) {
  if (this.isDisplayed()) {
    this.displays(false);
    return;
  }

  this.displays(true);
  this.focusSearchInput();
  this.resetSearchList();

  urls.forEach((url, idx) => {
    this.addSearchList(idx + ". " + url.title);
  });
};
