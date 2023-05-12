import { buildSearchItem } from "./build";

export const addSearchList = function (title, url) {
  const searchList = this.dom.searchList;

  searchList.appendChild(buildSearchItem(title, url));
};
