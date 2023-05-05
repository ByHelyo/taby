import { buildSearchItem } from "./build";

export const addSearchList = (menu, itemContent) => {
  const searchList = menu.querySelector(".taby-searchList");

  searchList.appendChild(buildSearchItem(itemContent));
};
