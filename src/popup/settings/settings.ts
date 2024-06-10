import browser from "webextension-polyfill";
import { Appearance, Context, PopupWindow, Storage } from "../../type/misc.ts";
import { popup_setup } from "../../core/setup/popup.ts";

const handleSelectAppearance = async function (theme: Appearance) {
  await browser.storage.sync.set({ [Storage.Appearance]: theme });
};

const handleSelectPopupWindow = async function (variant: PopupWindow) {
  await browser.storage.sync.set({ [Storage.PopupWindow]: variant });
};

const handleSelectPositionInline = async function (value: string) {
  await browser.storage.sync.set({ [Storage.PositionInline]: value });
};

const handleSelectPositionBlock = async function (value: string) {
  await browser.storage.sync.set({ [Storage.PositionBlock]: value });
};

async function main() {
  const promise = popup_setup(
    document.querySelector(".taby-root")!,
    Context.Popup,
  );

  const storage = await browser.storage.sync.get([
    Storage.Appearance,
    Storage.PopupWindow,
    Storage.PositionInline,
    Storage.PositionBlock,
  ]);

  const light_button = document.querySelector<HTMLInputElement>(
    "div:nth-child(1) input",
  )!;
  const dark_button = document.querySelector<HTMLInputElement>(
    "div:nth-child(2) input",
  )!;
  const popup_window = document.querySelector<HTMLInputElement>(
    ".option:nth-of-type(2) input",
  )!;
  const position_block = document.querySelector<HTMLInputElement>(
    ".option:nth-of-type(3) input",
  )!;
  const position_block_label = document.querySelector<HTMLSpanElement>(
    ".option:nth-of-type(3) span",
  )!;
  const position_inline = document.querySelector<HTMLInputElement>(
    ".option:nth-of-type(4) input",
  )!;
  const position_inline_label = document.querySelector<HTMLSpanElement>(
    ".option:nth-of-type(4) span",
  )!;

  if (storage[Storage.Appearance] === Appearance.Light) {
    light_button.checked = true;
  } else {
    dark_button.checked = true;
  }

  if (storage[Storage.PopupWindow] === PopupWindow.Fixed) {
    popup_window.checked = true;
  }

  position_block.value = storage[Storage.PositionBlock];
  position_block_label.textContent = storage[Storage.PositionBlock] + "%";
  position_inline.value = storage[Storage.PositionInline];
  position_inline_label.textContent = storage[Storage.PositionInline] + "%";

  light_button.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Light);
  });
  dark_button.addEventListener("click", function () {
    handleSelectAppearance(Appearance.Dark);
  });
  popup_window.addEventListener("click", function () {
    popup_window.checked
      ? handleSelectPopupWindow(PopupWindow.Fixed)
      : handleSelectPopupWindow(PopupWindow.UnFixed);
  });
  position_block.addEventListener("input", function () {
    handleSelectPositionBlock(position_block.value);
    position_block_label.textContent = position_block.value + "%";
  });
  position_inline.addEventListener("input", function () {
    handleSelectPositionInline(position_inline.value);
    position_inline_label.textContent = position_inline.value + "%";
  });

  await promise;
}

main();
