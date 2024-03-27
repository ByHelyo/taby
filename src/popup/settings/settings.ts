import browser from "webextension-polyfill";
import { Appearance, Context, PopupWindow } from "../../type/misc.ts";
import { popup_setup } from "../../core/setup/popup.ts";

const handleSelectAppearance = async function (theme: Appearance) {
  await browser.storage.local.set({ appearance: theme });
};

const handleSelectPopupWindow = async function (variant: PopupWindow) {
  await browser.storage.local.set({ popup_window: variant });
};

async function main() {
  const promise = popup_setup(
    document.querySelector(".taby-root")!,
    Context.Popup,
  );

  const storage_appearance = await browser.storage.local.get(["appearance"]);
  const storage_popup_window = await browser.storage.local.get([
    "popup_window",
  ]);
  const lightButton = document.querySelector<HTMLInputElement>(
    "div:nth-child(1) input",
  )!;
  const darkButton = document.querySelector<HTMLInputElement>(
    "div:nth-child(2) input",
  )!;
  const popup_window =
    document.querySelector<HTMLInputElement>(".toggle input")!;

  if (storage_appearance.appearance === Appearance.Light) {
    lightButton.checked = true;
  } else {
    darkButton.checked = true;
  }

  if (storage_popup_window.popup_window == PopupWindow.Fixed) {
    popup_window.checked = true;
  }

  lightButton.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Light);
  });
  darkButton.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Dark);
  });
  popup_window.addEventListener("click", function () {
    popup_window.checked
      ? handleSelectPopupWindow(PopupWindow.Fixed)
      : handleSelectPopupWindow(PopupWindow.UnFixed);
  });

  await promise;
}

main();
