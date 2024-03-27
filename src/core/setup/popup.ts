import browser from "webextension-polyfill";
import {
  handleChangeAppearance,
  handleChangePopupWindow,
} from "../handler/handler.ts";
import { Context } from "../../type/misc.ts";

export const popup_setup = async function (
  root: HTMLDivElement,
  context: Context,
) {
  await browser.storage.local
    .get(["appearance", "popup_window"])
    .then(function (storage) {
      const popup_window = storage.popup_window;
      const theme = storage.appearance;

      handleChangeAppearance(root, theme);

      if (context == Context.Popup) {
        handleChangePopupWindow(root, popup_window);
      }
    });

  browser.storage.onChanged.addListener(function (changes) {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === "appearance") {
        handleChangeAppearance(root, newValue);
      } else if (key == "popup_window" && context === Context.Popup) {
        handleChangePopupWindow(root, newValue);
      }
    }
  });
};
