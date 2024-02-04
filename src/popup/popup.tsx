import browser from "webextension-polyfill";
import { Appearance } from "../type/misc.ts";

const handleSelectAppearance = async (theme: Appearance) => {
  await browser.storage.local.set({ appearance: theme });
};

document.addEventListener("DOMContentLoaded", async () => {
  const storage = await browser.storage.local.get(["appearance"]);
  const lightButton = document.querySelector<HTMLInputElement>(
    "div:nth-child(1) input",
  )!;
  const darkButton = document.querySelector<HTMLInputElement>(
    "div:nth-child(2) input",
  )!;

  if (storage.appearance === Appearance.Light) {
    lightButton.checked = true;
  } else {
    darkButton.checked = true;
  }

  lightButton.addEventListener("click", () =>
    handleSelectAppearance(Appearance.Light),
  );
  darkButton.addEventListener("click", () =>
    handleSelectAppearance(Appearance.Dark),
  );
});
