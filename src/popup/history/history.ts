import { Context, MenuServiceOption } from "../../type/misc.ts";
import { search_history } from "../../core/service/search.ts";
import { buildHistory } from "../../core/dom/build.ts";
import { MenuService } from "../../core/service/menuService.ts";
import { popup_setup } from "../../core/setup/popup.ts";
import { eventKeydown } from "../event.ts";
import { goToUrl } from "../../core/service/goto.ts";
import { HistoryUrl } from "../../type/history.ts";

async function main() {
  const promises: Promise<void>[] = [];
  const opts: MenuServiceOption<HistoryUrl> = {
    context: Context.Popup,
    search: search_history,
    buildElement: buildHistory,
    goTo: goToUrl,
    placeholder: "Search history...",
  };
  const root = document.querySelector<HTMLDivElement>(".taby-root")!;
  const menuService = new MenuService(opts);
  const menuUi = menuService.getMenuUi();

  promises.push(popup_setup(root, opts.context));

  if (root) {
    root.prepend(menuUi.getMenuDom().getDom());
  }

  promises.push(menuService.setupElements());

  eventKeydown(menuUi);

  await Promise.all(promises);
}

main();
