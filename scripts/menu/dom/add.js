import { buildSearchItem } from "./build";

export const addSearchList = function (itemContent) {
  const searchList = this.dom.searchList;

  searchList.appendChild(buildSearchItem(itemContent));
};
