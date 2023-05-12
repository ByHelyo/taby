import Fuse from "fuse.js";

export const handleMenu = function (tabs) {
  if (this.isDisplayed()) {
    this.displays(false);
    return;
  }

  this.setTabs(tabs);
  this.displays(true);
  this.focusSearchInput();
  this.handleSearchItems(tabs);
};

export const handleSearchBar = function (searchInput) {
  const options = {
    keys: ["title", "url"],
  };

  const fuse = new Fuse(this.tabs, options);

  const matched = fuse.search(searchInput).map((tab) => {
    return {
      url: tab.item.url,
      title: tab.item.title,
    };
  });

  if (matched.length !== 0) {
    this.setSelectedTab(matched[0]);
  }
  this.handleSearchItems(matched);
};

export const handleSearchItems = function (tabs) {
  this.resetSearchList();

  tabs.forEach((tab, idx) => {
    this.addSearchList(idx + ". " + tab.title);
  });
};
