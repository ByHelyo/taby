import { Appearance } from "../../type/misc.ts";

const light = [
  ["--item-color", "#000000"],
  ["--background", "#F9FaFB"],
  ["--item-active", "#EFF0F1"],
  ["--hr-color", "#F3F4F6"],
  ["--input-color", "#191C18"],
  ["--input-placeholder-color", "#56566A"],
  ["--icon-filter", "none"],
  ["--ring-color", "rgb(0, 0, 0, 0.25)"],
  ["--icon-color", "#494949"],
  ["--border-color", "#b5bfd9"],
];

const dark = [
  ["--item-color", "#FEFFFE"],
  ["--background", "#262733"],
  ["--item-active", "#313240"],
  ["--input-color", "#E4E5F1"],
  ["--input-placeholder-color", "#D1D1D1"],
  ["--hr-color", "#313141"],
  [
    "--icon-filter",
    "invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)",
  ],
  ["--ring-color", "rgb(255, 255, 255, 0.25)"],
  ["--icon-color", "#f3f4f6"],
  ["--border-color", "#364469"],
];

export const handleChangeAppearance = function (
  root: HTMLDivElement,
  appearance: Appearance,
) {
  const style = root.style;
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