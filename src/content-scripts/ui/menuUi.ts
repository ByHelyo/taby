import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Tab } from "../../type/misc.ts";
import { Move, WindowService } from "../service/window.ts";

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
    const next = this.window.moveUp(selectedTab.idx);

    switch (next.move) {
      case Move.MovedToEnd:
        this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Move.MovedUp:
        this.moveWindowUp(tabs[next.start], tabs[next.end], (idx: number) =>
          this.handleOnClick(idx),
        );
        break;
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[next.next]);
  }

  moveDown() {
    const selectedTab = this.menuService.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const tabs = this.menuService.getTabs();
    const next = this.window.moveDown(selectedTab.idx);

    switch (next.move) {
      case Move.MovedToStart:
        this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Move.MovedDown:
        this.moveWindowDown(tabs[next.start], tabs[next.end], (idx: number) =>
          this.handleOnClick(idx),
        );
        break;
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[next.next]);
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

  moveWindowDown(
    tab1: Tab,
    tab2: Tab,
    callback: (internalIndex: number) => void,
  ) {
    this.dom.removeItem(`li[class~="taby-${tab1.idx}"]`);
    this.dom.addItem(tab2.key, tab2.idx, tab2.title, tab2.favIconUrl, callback);
  }
}
