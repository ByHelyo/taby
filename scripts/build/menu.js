export const buildMenu = () => {
  const menu = document.createElement("div");
  menu.classList.add("taby-menu");

  menu.append(buildSearch());
  return menu;
};

const buildSearch = () => {
  const search = document.createElement("div");
  search.classList.add("taby-search");

  search.appendChild(buildSearchInput());
  return search;
};

const buildSearchInput = () => {
  const searchInput = document.createElement("input");
  searchInput.classList.add("taby-searchInput");
  searchInput.placeholder = "Search";

  searchInput.appendChild(buildSearchButton());
  return searchInput;
};

const buildSearchButton = () => {
  const searchButton = document.createElement("button");
  searchButton.classList.add("taby-searchButton");
  searchButton.type = "submit";

  return searchButton;
};
