export const eventSearchOnInput = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("input", () => {
    menu.handleSearchBar(searchInput.value);
  });
};

export const eventSearchOnKeyUp = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("keyup", () => {
    chrome.runtime.sendMessage({
      type: "CHANGE_TAB",
    });
  });
};
