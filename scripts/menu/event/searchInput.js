export const eventSearchOnInput = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("input", () => {
    menu.handleSearchBar(searchInput.value);
  });
};

export const eventSearchOnKeyUp = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("keyup", (e) => {
    const selectedTab = menu.getSelectedTab();

    if (e.key === "Enter" && selectedTab !== null) {
      chrome.runtime.sendMessage({
        type: "CHANGE_TAB",
        tab: selectedTab,
      });

      menu.handleMenu(); /* Close menu */
    }
  });
};
