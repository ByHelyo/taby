export const buildMenu = function (
  search: HTMLDivElement,
  searchList: HTMLUListElement
): HTMLDivElement {
  const menu = document.createElement("div");
  menu.classList.add("taby-menu");
  menu.append(search);
  menu.appendChild(searchList);

  return menu;
};

export const buildSearch = function (
  searchInput: HTMLInputElement
): HTMLDivElement {
  const search = document.createElement("div");
  search.classList.add("taby-search");
  search.appendChild(searchInput);

  return search;
};

export const buildSearchInput = function (): HTMLInputElement {
  const searchInput = document.createElement("input");
  searchInput.classList.add("taby-searchInput");
  searchInput.placeholder = "Search";

  return searchInput;
};

export const buildSearchList = function (): HTMLUListElement {
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
