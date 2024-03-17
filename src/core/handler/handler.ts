import { Appearance } from "../../type/misc.ts";
import { light } from "../theme/light.ts";
import { dark } from "../theme/dark.ts";

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
