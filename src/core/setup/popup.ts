import browser from "webextension-polyfill";
import {
  handleChangeAppearance,
  handleChangePopupWindow,
  handlePosition,
} from "../handler/handler.ts";
import { Context, Storage } from "../../type/misc.ts";
import { WindowUi } from "../ui/window.ts";
import { Resource } from "../../type/resource.ts";

export const popup_setup = async function <T extends Resource>(
  root: HTMLDivElement,
  context: Context,
  window?: WindowUi<T>,
) {
  await browser.storage.local
    .get([
      Storage.Appearance,
      Storage.PopupWindow,
      Storage.PositionInline,
      Storage.PositionBlock,
    ])
    .then(async function (storage) {
      const theme = storage[Storage.Appearance];
      const popup_window = storage[Storage.PopupWindow];
      const position_inline = storage[Storage.PositionInline];
      const position_block = storage[Storage.PositionBlock];

      handleChangeAppearance(root, theme);

      if (context == Context.Popup) {
        handleChangePopupWindow(root, popup_window);
      }

      if (context == Context.ContentScript) {
        handlePosition(root, position_block, position_inline);
        await window?.resize();
      }
    });

  browser.storage.onChanged.addListener(async function (changes) {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === Storage.Appearance) {
        handleChangeAppearance(root, newValue);
      } else if (key === Storage.PopupWindow && context === Context.Popup) {
        handleChangePopupWindow(root, newValue);
      } else if (
        key === Storage.PositionInline &&
        context === Context.ContentScript
      ) {
        handlePosition(root, null, newValue);
      } else if (
        key === Storage.PositionBlock &&
        context === Context.ContentScript
      ) {
        handlePosition(root, newValue, null);
        await window?.resize();
      }
    }
  });
};
