export const buildMenu = () => {
  const menu = document.createElement("div");
  menu.classList.add("taby-menu");

  menu.append(buildSearchInput());
  return menu;
};

const buildSearchInput = () => {
  const searchInput = document.createElement("input");
  searchInput.classList.add("taby-searchInput");

  return searchInput;
};
