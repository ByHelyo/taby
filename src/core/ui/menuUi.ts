import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Action, WindowService } from "../service/window.ts";
import { Tab } from "../../type/tab.ts";

export class MenuUi {
  dom: MenuDom;
  menuService: MenuService;
  window: WindowService;
  timeout: number | undefined;

  constructor(menuService: MenuService, window: WindowService) {
    this.menuService = menuService;
    this.dom = new MenuDom();
    this.window = window;
    this.dom.onInput(async (e) => {
      await this.handleOnInput(e);
    });
    this.dom.onKeyDown(async (e) => {
      await this.handleOnKeyDown(e);
    });
  }

  async setTabs(tabs: Tab[], start?: number, end?: number) {
    this.window.setSize(tabs.length);

    this.dom.clearList();

    if (tabs.length === 0) {
      this.dom.hideResults();
      return;
    }

    this.dom.displayResults();

    if (start && end) {
      this.dom.addItems(tabs.slice(start, end), (idx: number) => {
        this.handleOnClick(idx);
      });
    } else {
      this.dom.addItems(tabs.slice(0, this.window.getEnd()), (idx: number) => {
        this.handleOnClick(idx);
      });
    }
  }

  setSelectedTab(tab: Tab) {
    this.dom.selectItem(tab.idx);
  }

  getMenuDom() {
    return this.dom;
  }

  contains(elt: HTMLElement): boolean {
    return this.dom.contains(elt);
  }

  async displays(val: boolean) {
    if (val) {
      await this.dom.displays(true);
      this.dom.clearInput();
      this.dom.focusInput();
    } else {
      await this.dom.displays(false);
    }
  }

  async handleOnClick(idx: number) {
    const selectedTab = this.menuService.getSelectedTab();

    if (selectedTab && selectedTab === this.menuService.getTabs()[idx]) {
      await this.menuService.goTo();
    } else {
      this.menuService.setSelectedTab(this.menuService.getTabs()[idx]);
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

    const matched = await this.menuService.search(searchInput);

    await this.menuService.setTabs(matched);

    if (matched.length > 0) {
      this.menuService.setSelectedTab(matched[0]);
    } else {
      this.menuService.setSelectedTab(null);
    }
  }

  async handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.menuService.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          await this.menuService.goTo();
        }
        break;
      case "Escape":
        await this.menuService.close();
        break;
      case "ArrowUp":
        await this.moveUp();
        break;
      case "ArrowDown":
        await this.moveDown();
        break;
    }
  }

  async moveUp() {
    const selectedTab = this.menuService.getSelectedTab();
    if (!selectedTab) {
      return;
    }

    const tabs = this.menuService.getTabs();
    const next = this.window.moveUp(selectedTab.idx);

    switch (next.action) {
      case Action.MovedToEnd:
        await this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Action.MovedUp:
        if (this.window.getCapacity() > 0) {
          this.dom.removeItem(tabs[next.end].idx);
          this.dom.pushItem(tabs[next.start], (idx) => this.handleOnClick(idx));
        }
        break;
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[next.next]);
  }

  async moveDown() {
    const selectedTab = this.menuService.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const tabs = this.menuService.getTabs();
    const next = this.window.moveDown(selectedTab.idx);

    switch (next.action) {
      case Action.MovedToStart:
        await this.setTabs(this.menuService.getTabs(), next.start, next.end);
        break;
      case Action.MovedDown:
        if (this.window.getCapacity() > 0) {
          this.dom.removeItem(tabs[next.start].idx);
          this.dom.addItem(tabs[next.end], (idx) => this.handleOnClick(idx));
        }
        break;
    }

    this.menuService.setSelectedTab(this.menuService.getTabs()[next.next]);
  }

  handleResize() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      this.window.resize();

      await this.setTabs(
        this.menuService.getTabs(),
        this.window.getStart(),
        this.window.getEnd(),
      );

      const selectedTab = this.menuService.getSelectedTab();

      if (!selectedTab) {
        return;
      }

      this.menuService.setSelectedTab(this.menuService.getTabs()[0]);
    }, 100);
  }
}
