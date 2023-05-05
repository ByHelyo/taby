import { resetSearchList } from "../dom/menu/delete";
import { addSearchList } from "../dom/menu/add";

export const handleMenu = (menu, urls) => {
  if (menu.classList.contains("taby-display")) {
    menu.classList.remove("taby-display");
    return;
  }

  menu.classList.add("taby-display");

  resetSearchList(menu);

  urls.forEach((url, idx) => {
    addSearchList(menu, idx + ". " + url.title);
  });
};
