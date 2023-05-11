import Fuse from "fuse.js";

export const handleMenu = function (urls) {
  if (this.isDisplayed()) {
    this.displays(false);
    return;
  }

  this.setUrls(urls);
  this.displays(true);
  this.focusSearchInput();

  this.handleSearchItems(urls);
};

export const handleSearchBar = function (searchInput) {
  const options = {
    keys: ["title", "url"],
  };

  const fuse = new Fuse(this.urls, options);

  const res = fuse.search(searchInput).map((url) => {
    return {
      url: url.item.url,
      title: url.item.title,
    };
  });

  this.handleSearchItems(res);
};

export const handleSearchItems = function (urls) {
  this.resetSearchList();

  urls.forEach((url, idx) => {
    this.addSearchList(idx + ". " + url.title);
  });
};
