export const eventSearchOnInput = function (menu) {
  menu.dom.searchInput.addEventListener("input", () => {
    const searchInputValue = menu.dom.searchInput.value;

    menu.handleSearchBar(searchInputValue);
  });
};
