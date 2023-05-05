export const handleMenu = (menu, urls) => {
  if (menu.classList.contains("taby-display")) {
    menu.classList.remove("taby-display");
  } else {
    menu.classList.add("taby-display");
  }
};
