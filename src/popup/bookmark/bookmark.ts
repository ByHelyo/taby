import { Context, MenuServiceOption } from "../../type/misc.ts";
import { search_bookmarks } from "../../core/service/search.ts";
import { buildBookmark } from "../../core/dom/build.ts";
import { MenuService } from "../../core/service/menuService.ts";
import { popup_setup } from "../../core/setup/popup.ts";
import { eventKeydown } from "../event.ts";
import { Bookmark } from "../../type/bookmark.ts";
import { goToUrl } from "../../core/service/goto.ts";

async function main() {
  const promises: Promise<void>[] = [];
  const opts: MenuServiceOption<Bookmark> = {
    context: Context.Popup,
    search: search_bookmarks,
    buildElement: buildBookmark,
    goTo: goToUrl,
    placeholder: "Search bookmark...",
  };
  const root = document.querySelector<HTMLDivElement>(".taby-root")!;
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  promises.push(popup_setup(root));

  if (root) {
    root.prepend(menuUi.getMenuDom().getDom());
  }

  promises.push(menuService.setupElements());

  eventKeydown(menuUi);

  await Promise.all(promises);
}

main();
