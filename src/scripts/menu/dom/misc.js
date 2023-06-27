export const focusSearchInput = function () {
  const searchInput = this.dom.searchInput;

  searchInput.focus();
};

export const isDisplayed = function () {
  return this.dom.menu.classList.contains("taby-display");
};

export const displays = function (show) {
  if (show) {
    this.dom.menu.classList.add("taby-display");
  } else {
    this.dom.menu.classList.remove("taby-display");
  }
};

export const contains = function (domElement) {
  return this.dom.menu.contains(domElement);
};

export const clearSearchInput = function () {
  const searchInput = this.dom.searchInput;

  searchInput.value = "";
};
