import { MenuUi } from "../core/ui/menuUi.ts";
import { Idx } from "../type/misc.ts";

export const eventKeydown = function <T extends Idx>(menuUi: MenuUi<T>) {
  document.addEventListener(
    "keydown",
    async (e) => await menuUi.handleOnKeyDown(e),
  );
};
