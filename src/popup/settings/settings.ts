import browser from "webextension-polyfill";
import { Appearance } from "../../type/misc.ts";
import { appearance_setup } from "../../core/setup/appearance.ts";

const handleSelectAppearance = async function (theme: Appearance) {
  await browser.storage.local.set({ appearance: theme });
};

async function main() {
  const promise = appearance_setup(document.querySelector("body > div")!);

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

  lightButton.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Light);
  });
  darkButton.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Dark);
  });

  await promise;
}

main();
