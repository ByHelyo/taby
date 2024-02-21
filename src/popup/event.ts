import { MenuUi } from "../core/ui/menuUi.ts";
import { Resource } from "../type/resource.ts";

export const eventKeydown = function <T extends Resource>(menuUi: MenuUi<T>) {
  document.addEventListener(
    "keydown",
    async (e) => await menuUi.handleOnKeyDown(e),
  );
};
