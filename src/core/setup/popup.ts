import browser from "webextension-polyfill";
import {
  handleChangeAppearance,
  handleChangePopupWindow,
} from "../handler/handler.ts";

export const popup_setup = async function (root: HTMLDivElement) {
  await browser.storage.local.get(["appearance"]).then(function (storage) {
    const theme = storage.appearance;
    handleChangeAppearance(root, theme);
  });

  await browser.storage.local.get(["popup_window"]).then(function (storage) {
    const popup_window = storage.popup_window;
    handleChangePopupWindow(root, popup_window);
  });

  browser.storage.onChanged.addListener(function (changes) {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === "appearance") {
        handleChangeAppearance(root, newValue);
      } else if (key == "popup_window") {
        handleChangePopupWindow(root, newValue);
      }
    }
  });
};
