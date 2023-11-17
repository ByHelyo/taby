import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Tab } from "../../type/misc.ts";
import { Action, WindowService } from "../service/window.ts";

export class MenuUi {
  dom: MenuDom;
  menuService: MenuService;
  window: WindowService;
  timeout: number | undefined;

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
      this.menuService.goTo();
    } else {
      this.menuService.setSelectedTab(this.menuService.getTabs()[idx]);
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

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
          this.menuService.goTo();
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

    switch (next.action) {
      case Action.MovedToEnd:
        this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Action.MovedUp:
        this.dom.removeItem(tabs[next.end].idx);
        this.dom.pushItem(tabs[next.start], (idx) => this.handleOnClick(idx));
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

    switch (next.action) {
      case Action.MovedToStart:
        this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Action.MovedDown:
        this.dom.removeItem(tabs[next.start].idx);
        this.dom.addItem(tabs[next.end], (idx) => this.handleOnClick(idx));
        break;
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[next.next]);
  }

  handleResize() {
    clearTimeout(this.timeout);
    this.window.resize();
    this.timeout = setTimeout(() => {
      this.window.resize();

      this.setTabs(
        this.menuService.getTabs(),
        this.window.getStart(),
        this.window.getEnd(),
      );

      const selectedTab = this.menuService.getSelectedTab();

      if (this.window.getCapacity() == 0) {
        this.menuService.setSelectedTab(null);
        return;
      }

      if (!selectedTab && this.window.getCapacity() > 0) {
        this.menuService.setSelectedTab(
          this.menuService.getTabs()[this.window.getStart()],
        );
        return;
      }

      if (!selectedTab) {
        return;
      }

      let next = Math.max(this.window.getStart(), selectedTab.idx);
      next = Math.min(this.window.getEnd() - 1, next);

      this.menuService.setSelectedTab(this.menuService.getTabs()[next]);
    }, 100);
  }
}
