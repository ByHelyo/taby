import Fuse from "fuse.js";

export const handleMenu = function (tabs) {
  this.setSelectedTab(null); /* Clear selected tab */

  if (this.isDisplayed()) {
    this.displays(false);
    return;
  }

  this.setTabs(tabs);
  this.displays(true);
  this.clearSearchInput();
  this.focusSearchInput();
  this.handleSearchItems(tabs);
};

export const handleSearchBar = function (searchInput) {
  const options = {
    keys: ["title", "url", "index"],
  };

  if (searchInput === "") {
    this.handleSearchItems(this.tabs);
    return;
  }

  const fuse = new Fuse(this.tabs, options);

  const matched = fuse.search(searchInput).map((tab) => {
    return {
      url: tab.item.url,
      title: tab.item.title,
      id: tab.item.id,
      index: tab.item.index,
    };
  });

  this.handleSearchItems(matched);
};

export const handleSearchItems = function (tabs) {
  this.resetSearchList();

  tabs.forEach((tab) => {
    this.addSearchList(tab.index, tab.title, tab.url);
  });
};
