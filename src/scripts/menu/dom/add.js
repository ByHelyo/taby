import { buildSearchItem } from "./build";

export const addSearchList = function (index, title, url) {
  const searchList = this.dom.searchList;

  searchList.appendChild(buildSearchItem(index, title, url));
};