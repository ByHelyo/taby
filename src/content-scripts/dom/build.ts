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
  searchInput.placeholder = "Search...";

  return searchInput;
};

export const buildSearchList = function (): HTMLUListElement {
  const searchList = document.createElement("ul");
  searchList.classList.add("taby-searchList");
  return searchList;
};

export const buildSearchItem = function (
  key: number,
  idx: number,
  title: string,
  favIconUrl: string,
  callback: (idx: number) => void,
) {
  const searchItem = document.createElement("li");
  searchItem.classList.add("taby-searchItem");
  searchItem.classList.add(`taby-${idx}`);

  searchItem.appendChild(buildItemKey(key));
  searchItem.appendChild(buildItemImg(favIconUrl));
  searchItem.append(buildItemTitle(title));
  searchItem.addEventListener("click", () => callback(idx));
  return searchItem;
};

const buildItemKey = function (key: number) {
  const keyElt = document.createElement("span");
  keyElt.innerText = String(key);
  keyElt.classList.add("taby-searchKey");

  return keyElt;
};

const buildItemImg = function (url: string) {
  const imgElt = document.createElement("img");
  imgElt.src = url;
  imgElt.classList.add("taby-searchImg");

  return imgElt;
};

const buildItemTitle = function (title: string) {
  const titleElt = document.createElement("span");
  titleElt.innerText = title;
  titleElt.classList.add("taby-searchTitle");

  return titleElt;
};
