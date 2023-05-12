export const eventSearchOnInput = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("input", () => {
    menu.handleSearchBar(searchInput.value);
  });
};

export const eventSearchOnKeyUp = function (menu) {
  const searchInput = menu.dom.searchInput;

  searchInput.addEventListener("keydown", (e) => {
    const selectedTab = menu.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          chrome.runtime.sendMessage({
            type: "CHANGE_TAB",
            tab: selectedTab,
          });

          menu.handleMenu(); /* Close menu */
        }
        break;
      case "Escape":
        menu.handleMenu(); /* Close menu */
        break;
    }
  });
};
