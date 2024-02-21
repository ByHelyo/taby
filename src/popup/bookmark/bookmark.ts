import { Context, MenuServiceOption } from "../../type/misc.ts";
import { search_bookmarks } from "../../core/service/search.ts";
import { buildBookmark } from "../../core/dom/build.ts";
import { MenuService } from "../../core/service/menuService.ts";
import { appearance_setup } from "../../core/setup/appearance.ts";
import { eventKeydown } from "../event.ts";
import { Bookmark } from "../../type/bookmark.ts";

async function main() {
  const promises: Promise<void>[] = [];
  const opts: MenuServiceOption<Bookmark> = {
    context: Context.Popup,
    search: search_bookmarks,
    buildElement: buildBookmark,
  };
  const root = document.querySelector<HTMLDivElement>("body > div")!;
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  promises.push(appearance_setup(root));

  if (root) {
    root.prepend(menuUi.getMenuDom().getRoot());
  }

  promises.push(menuService.setupTabs());

  eventKeydown(menuUi);

  await Promise.all(promises);
}

main();
