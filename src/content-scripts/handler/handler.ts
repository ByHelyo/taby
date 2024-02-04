import { Appearance } from "../../type/misc.ts";
import { MenuUi } from "../ui/menuUi.ts";

const light = [
  ["--item-color", "#000000"],
  ["--background", "#F9FaFB"],
  ["--item-active", "#EFF0F1"],
  ["--hr-color", "#F3F4F6"],
  ["--input-color", "#191C18"],
  ["--input-placeholder-color", "#BEBFC0"],
  ["--icon-filter", "none"],
];

const dark = [
  ["--item-color", "#FEFFFE"],
  ["--background", "#262733"],
  ["--item-active", "#313240"],
  ["--input-color", "#E4E5F1"],
  ["--input-placeholder-color", "#58576A"],
  ["--hr-color", "#313141"],

  [
    "--icon-filter",
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)",
  ],
];

export const handleChangeAppearance = function (
  menuUi: MenuUi,
  appearance: Appearance,
) {
  const style = menuUi.dom.menu.style;
  let kit;
  if (appearance === Appearance.Light) {
    kit = light;
  } else {
    kit = dark;
  }

  for (const [key, val] of kit) {
    style.setProperty(key, val);
  }
};
