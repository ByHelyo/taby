import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Tab } from "../../type/misc.ts";
import { WindowService } from "../service/window.ts";

export class MenuUi {
  dom: MenuDom;
  menuService: MenuService;
  window: WindowService;

  constructor(menuService: MenuService) {
    this.menuService = menuService;
    this.dom = new MenuDom();
    this.window = new WindowService();
    this.dom.onInput(async (e) => {
      await this.handleOnInput(e);
    });
    this.dom.onKeyDown((e) => {
      this.handleOnKeyDown(e);
    });
  }

  setTabs(tabs: Tab[], start?: number, end?: number) {
    this.window.setSize(tabs.length);

    this.dom.clearList();
    if (start && end) {
      this.dom.addItems(tabs.slice(start, end), (idx: number) => {
        this.handleOnClick(idx);
      });
    } else {
      this.dom.addItems(
        tabs.slice(0, this.window.getCapacity()),
        (idx: number) => {
          this.handleOnClick(idx);
        },
      );
    }
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

    if (selectedTab && selectedTab === this.menuService.getTabs()[idx]) {
      this.menuService.goTo(selectedTab);
    } else {
      this.menuService.setSelectedTab(this.menuService.getTabs()[idx]);
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

    if (searchInput === "") {
      this.setTabs(this.menuService.getTabs());
      this.menuService.setSelectedTab(this.menuService.getTabs()[0]);
      return;
    }

    const matched = await this.menuService.search(searchInput);

    this.menuService.setTabs(matched);

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

    const tabs = this.menuService.getTabs();
    const nextIndex = (selectedTab.idx - 1 + tabs.length) % tabs.length;

    if (!this.window.isValid(nextIndex)) {
      if (nextIndex == tabs.length - 1) {
        this.window.moveEnd();

        this.setTabs(
          this.menuService.getTabs(),
          this.window.getStart(),
          this.window.getEnd(),
        );
      } else {
        this.window.moveUp();
        this.moveWindowUp(
          tabs[this.window.getStart()],
          tabs[this.window.getEnd()],
          (idx: number) => this.handleOnClick(idx),
        );
      }
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[nextIndex]);
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
    const tabs = this.menuService.getTabs();
    const nextIndex = (selectedTab.idx + 1) % tabs.length;

    if (!this.window.isValid(nextIndex)) {
      if (nextIndex == 0) {
        this.window.moveStart();
        this.setTabs(this.menuService.getTabs());
      } else {
        this.moveWindowDown(
          tabs[this.window.getStart()],
          tabs[this.window.getEnd()],
          (idx: number) => this.handleOnClick(idx),
        );
        this.window.moveDown();
      }
    }
    this.menuService.setSelectedTab(this.menuService.getTabs()[nextIndex]);
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
