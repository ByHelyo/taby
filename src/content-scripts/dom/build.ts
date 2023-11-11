import browser from "webextension-polyfill";

export const buildMenu = function (
  search: HTMLDivElement,
  searchList: HTMLUListElement,
): HTMLDivElement {
  const menu = document.createElement("div");
  menu.classList.add("taby-menu");
  menu.append(search);
  menu.appendChild(searchList);

  return menu;
};

export const buildSearch = function (
  searchInput: HTMLInputElement,
): HTMLDivElement {
  const search = document.createElement("div");
  search.classList.add("taby-search");
  search.appendChild(buildGlassImage());
  search.appendChild(searchInput);

  const glass = document.createElement("img");
  search.append(glass);

  return search;
};

const buildGlassImage = function (): HTMLImageElement {
  const image = document.createElement("img");
  image.src = browser.runtime.getURL("image/glass.svg");
  image.classList.add("taby-glass");
  return image;
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
  key: number,
  internalIndex: number,
  title: string,
  callback: (internalIndex: number) => void,
) {
  const searchItem = document.createElement("li");
  searchItem.classList.add("taby-searchItem");

  searchItem.appendChild(buildSearchKey(key));
  searchItem.append(buildSearchTitle(title));
  searchItem.addEventListener("click", () => callback(internalIndex));
  return searchItem;
};

const buildSearchKey = function (key: number) {
  const searchKey = document.createElement("span");
  searchKey.innerText = String(key);
  searchKey.classList.add("taby-searchKey");

  return searchKey;
};

const buildSearchTitle = function (title: string) {
  const searchTitle = document.createElement("span");
  searchTitle.innerText = title;
  searchTitle.classList.add("taby-searchTitle");

  return searchTitle;
};
