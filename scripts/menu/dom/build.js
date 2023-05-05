export const buildMenu = function () {
  const menu = document.createElement("div");
  menu.classList.add("taby-menu");

  const { search, searchInput } = buildSearch();
  const searchList = buildSearchList();

  menu.append(search);
  menu.appendChild(searchList);

  return {
    menu,
    search,
    searchInput,
    searchList,
  };
};

const buildSearch = function () {
  const search = document.createElement("div");
  search.classList.add("taby-search");

  const searchInput = buildSearchInput();

  search.appendChild(searchInput);
  return {
    search,
    searchInput,
  };
};

const buildSearchInput = function () {
  const searchInput = document.createElement("input");
  searchInput.classList.add("taby-searchInput");
  searchInput.placeholder = "Search";

  return searchInput;
};

const buildSearchList = function () {
  const searchList = document.createElement("ul");
  searchList.classList.add("taby-searchList");
  return searchList;
};

export const buildSearchItem = function (itemContent) {
  const searchItem = document.createElement("li");
  searchItem.classList.add("taby-searchItem");
  searchItem.innerText = itemContent;

  return searchItem;
};
