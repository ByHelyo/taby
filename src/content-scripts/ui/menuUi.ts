import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Tab } from "../../type/misc.ts";
import { within } from "./misc.ts";

const SEARCH_INPUT_SIZE: number = 60;
const PADDINGS_SEARCH_LIST: number = 16;
const SEARCH_ITEM_SIZE: number = 40;

export class MenuUi {
  tabs: Tab[];
  dom: MenuDom;
  menuService: MenuService;
  size: number;
  window_left: number;
  window_right: number;

  constructor(menuService: MenuService) {
    this.menuService = menuService;
    this.tabs = [];
    this.dom = new MenuDom();
    const menu_max_size =
      window.innerHeight * 0.7 - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST;
    this.size = Math.floor(menu_max_size / SEARCH_ITEM_SIZE);
    this.window_left = 0;
    this.window_right = this.size;
    this.dom.onInput(async (e) => {
      await this.handleOnInput(e);
    });
    this.dom.onKeyDown((e) => {
      this.handleOnKeyDown(e);
    });
  }

  setTabs(tabs: Tab[], start?: number, end?: number) {
    this.tabs = tabs;

    this.dom.clearList();
    if (start && end) {
      this.dom.addItems(this.tabs.slice(start, end), (idx: number) => {
        this.handleOnClick(idx);
      });
    } else {
      this.dom.addItems(this.tabs.slice(0, this.size), (idx: number) => {
        this.handleOnClick(idx);
      });
    }
  }

  getTabs() {
    return this.tabs;
  }

  setSelectedTab(tab: Tab) {
    this.dom.selectItem(tab.idx);
  }

  contains(elt: HTMLElement): boolean {
    return this.dom.contains(elt);
  }

  displays(val: boolean) {
    if (val) {
      this.dom.displays(true);
      this.dom.clearInput();
      this.dom.focusInput();
    } else {
      this.dom.displays(false);
    }
  }

  handleOnClick(idx: number) {
    const selectedTab = this.menuService.getSelectedTab();

    if (selectedTab && selectedTab === this.getTabs()[idx]) {
      this.menuService.goTo(selectedTab);
    } else {
      this.menuService.setSelectedTab(this.getTabs()[idx]);
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

    if (searchInput === "") {
      this.setTabs(this.getTabs());
      this.setSelectedTab(this.getTabs()[0]);
      return;
    }

    const matched = await this.menuService.search(searchInput);

    this.setTabs(matched);

    if (matched.length > 0) {
      this.menuService.setSelectedTab(matched[0]);
    } else {
      this.menuService.setSelectedTab(null);
    }
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.menuService.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          this.menuService.goTo(selectedTab);
        }
        break;
      case "Escape":
        this.menuService.close();
        break;
      case "ArrowUp":
        this.moveUp();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
    }
  }

  moveUp() {
    const selectedTab = this.menuService.getSelectedTab();
    if (!selectedTab) {
      return;
    }

    const n = this.getTabs().length;
    const nextIndex = (selectedTab.idx - 1 + n) % n;

    if (within(nextIndex, this.window_left, this.window_right)) {
      const tabs = this.getTabs();

      if (nextIndex == n - 1) {
        console.log("asd");
        this.window_left = this.getTabs().length - this.size;
        this.window_right = this.getTabs().length;
        this.setTabs(
          this.menuService.getTabs(),
          this.window_left,
          this.window_right,
        );
      } else {
        --this.window_left;
        --this.window_right;
        this.moveWindowUp(
          tabs[this.window_left],
          tabs[this.window_right],
          (idx: number) => this.handleOnClick(idx),
        );
      }
    }

    this.menuService.setSelectedTab(this.getTabs()[nextIndex]);
  }

  moveWindowUp(
    tab1: Tab,
    tab2: Tab,
    callback: (internalIndex: number) => void,
  ) {
    this.dom.removeItem(`li[class~="taby-${tab2.idx}"]`);
    this.dom.pushItem(
      tab1.key,
      tab1.idx,
      tab1.title,
      tab1.favIconUrl,
      callback,
    );
  }

  moveDown() {
    const selectedTab = this.menuService.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getTabs().length;
    const nextIndex = (selectedTab.idx + 1) % n;

    if (within(nextIndex, this.window_left, this.window_right)) {
      const tabs = this.getTabs();

      if (nextIndex == 0) {
        this.window_left = 0;
        this.window_right = this.size;
        this.setTabs(this.menuService.getTabs());
      } else {
        this.moveWindowDown(
          tabs[this.window_left],
          tabs[this.window_right],
          (idx: number) => this.handleOnClick(idx),
        );
        ++this.window_left;
        ++this.window_right;
      }
    }
    this.menuService.setSelectedTab(this.getTabs()[nextIndex]);
  }

  moveWindowDown(
    tab1: Tab,
    tab2: Tab,
    callback: (internalIndex: number) => void,
  ) {
    this.dom.removeItem(`li[class~="taby-${tab1.idx}"]`);
    this.dom.addItem(tab2.key, tab2.idx, tab2.title, tab2.favIconUrl, callback);
  }
}
