import { Appearance, PopupWindow } from "../../type/misc.ts";
import { light } from "../theme/light.ts";
import { dark } from "../theme/dark.ts";

export const handleChangeAppearance = function (
  root: HTMLDivElement,
  appearance: Appearance,
) {
  const style = root.style;
  const theme = appearance == Appearance.Light ? light : dark;

  for (const [key, val] of theme) {
    style.setProperty(key, val);
  }
};

export const handleChangePopupWindow = function (
  root: HTMLDivElement,
  popup_window: PopupWindow,
) {
  const style = root.style;

  const value = popup_window == PopupWindow.UnFixed ? "auto" : "600px";

  style.setProperty("height", value);
};

export const handlePosition = function (
  root: HTMLDivElement,
  block: string | null,
  inline: string | null,
) {
  const style = root.style;

  block && style.setProperty("--position-block", block + "%");
  inline && style.setProperty("--position-inline", inline + "%");
};
