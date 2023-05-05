export const focusSearchInput = function () {
  const searchInput = this.dom.searchInput;

  searchInput.focus();
};

export const isDisplayed = function () {
  return this.dom.menu.classList.contains("taby-display");
};

export const display = function (show) {
  if (show) {
    this.dom.menu.classList.add("taby-display");
  } else {
    this.dom.menu.classList.remove("taby-display");
  }
};
