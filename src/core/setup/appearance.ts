import browser from "webextension-polyfill";
import { handleChangeAppearance } from "../handler/handler.ts";

export const appearance_setup = async function (root: HTMLDivElement) {
  await browser.storage.local.get(["appearance"]).then(function (storage) {
    const theme = storage.appearance;
    handleChangeAppearance(root, theme);
  });

  browser.storage.onChanged.addListener(function (changes) {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === "appearance") {
        handleChangeAppearance(root, newValue);
      }
    }
  });
};
