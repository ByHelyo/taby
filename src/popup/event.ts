import { MenuUi } from "../core/ui/menuUi.ts";

export const eventKeydown = function (menuUi: MenuUi) {
  document.addEventListener(
    "keydown",
    async (e) => await menuUi.handleOnKeyDown(e),
  );
};
