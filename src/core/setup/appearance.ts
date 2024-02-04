import browser from "webextension-polyfill";
import { handleChangeAppearance } from "../handler/handler.ts";
import { MenuUi } from "../ui/menuUi.ts";

export const appearance_setup = async function (menuUi: MenuUi) {
  await browser.storage.local.get(["appearance"]).then(function (storage) {
    const theme = storage.appearance;
    handleChangeAppearance(menuUi, theme);
  });

  browser.storage.onChanged.addListener(function (changes) {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === "appearance") {
        handleChangeAppearance(menuUi, newValue);
      }
    }
  });
};
