import browser from "webextension-polyfill";
import { EAppearance, EPopupWindow, EScroll, EStorage } from "~/type/misc";

export const handleSelectAppearance = async function (theme: EAppearance) {
  await browser.storage.local.set({ [EStorage.Appearance]: theme });
};

export const handleSelectPopupWindow = async function (variant: EPopupWindow) {
  await browser.storage.local.set({ [EStorage.PopupWindow]: variant });
};

export const handleSelectScroll = async function (value: EScroll) {
  await browser.storage.local.set({ [EStorage.Scroll]: value });
};
