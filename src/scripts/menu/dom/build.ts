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

export const buildSearchItem = function (
  index: string,
  title: string,
  url: string
) {
  const searchItem = document.createElement("li");
  searchItem.classList.add("taby-searchItem");

  searchItem.appendChild(buildSearchIndex(index));
  searchItem.append(buildSearchTitle(title));
  searchItem.appendChild(buildSearchUrl(url));
  return searchItem;
};

const buildSearchIndex = function (index: string) {
  const searchIndex = document.createElement("span");
  searchIndex.innerText = index;
  searchIndex.classList.add("taby-searchIndex");

  return searchIndex;
};

const buildSearchTitle = function (title: string) {
  const searchTitle = document.createElement("span");
  searchTitle.innerText = title;
  searchTitle.classList.add("taby-searchTitle");

  return searchTitle;
};

const buildSearchUrl = function (url: string) {
  const searchUrl = document.createElement("span");
  searchUrl.classList.add("taby-searchUrl");
  searchUrl.innerText = url;

  return searchUrl;
};
