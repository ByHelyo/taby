import { Appearance } from "../../type/misc.ts";

const light = [
  ["--text-color", "#000000"],
  ["--background", "#FCFCFC"],
  ["--background-active", "#F2F2F2"],
  ["--hr-color", "#F3F4F6"],
  ["--input-color", "#191C18"],
  ["--input-placeholder-color", "#56566A"],
  ["--ring-color", "rgb(216, 216, 216)"],
  ["--icon-color", "#494949"],
  ["--border-color", "#b5bfd9"],
  [
    "--icon-filter",
    "invert(32%) sepia(9%) saturate(951%) hue-rotate(202deg) brightness(97%) contrast(86%)",
  ],
];

const dark = [
  ["--text-color", "#FEFFFE"],
  ["--background", "#2C2C30"],
  ["--background-active", "#393A3D"],
  ["--input-color", "#E4E5F1"],
  ["--input-placeholder-color", "#D1D1D1"],
  ["--hr-color", "#313141"],
  ["--ring-color", "rgba(73, 75, 83, 0.898"],
  ["--icon-color", "#f3f4f6"],
  ["--border-color", "#364469"],
  [
    "--icon-filter",
    "invert(94%) sepia(0%) saturate(40%) hue-rotate(189deg) brightness(94%) contrast(83%)",
  ],
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
