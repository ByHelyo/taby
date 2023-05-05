export const handleMenu = async (menu) => {
  if (menu.classList.contains("taby-display")) {
    menu.classList.remove("taby-display");
  } else {
    menu.classList.add("taby-display");
    const response = await chrome.runtime.sendMessage({ type: "ASK_TAB_URLS" });

    console.log(response);
  }
};
