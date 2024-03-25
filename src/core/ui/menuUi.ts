import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { WindowUi } from "./window.ts";
import { Context } from "../../type/misc.ts";
import { Resource } from "../../type/resource.ts";
import { next_location } from "../misc/location.ts";

export class MenuUi<T extends Resource> {
  dom: MenuDom<T>;
  menuService: MenuService<T>;
  window: WindowUi<T>;
  timeout: number | undefined;

  constructor(menuService: MenuService<T>) {
    this.menuService = menuService;
    this.dom = new MenuDom(menuService);
    this.window = new WindowUi(menuService, this, this.dom);

    this.dom.onInput(async (e) => {
      await this.handleOnInput(e);
    });

    if (menuService.getContext() === Context.ContentScript) {
      this.dom.onKeyDown(async (e) => {
        await this.handleOnKeyDown(e);
      });
    }
  }

  async setElements() {
    const elements = this.menuService.getElements();

    this.dom.clearList();

    if (elements.length === 0) {
      this.dom.hideResults();
      return;
    }

    this.dom.displayResults();

    this.window.setElements();
  }

  setSelectedElement(element: T) {
    this.dom.selectItem(element.idx);
  }

  getMenuDom() {
    return this.dom;
  }

  contains(elt: HTMLElement): boolean {
    return this.dom.contains(elt);
  }

  async displays(val: boolean) {
    if (val) {
      this.dom.clearInput();
      await this.dom.displays(true);
      this.dom.focusInput();
    } else {
      await this.dom.displays(false);
    }
  }

  async handleOnClick(idx: number) {
    const selectedTab = this.menuService.getSelectedElement();

    if (selectedTab && selectedTab === this.menuService.getElements()[idx]) {
      await this.menuService.goTo();
    } else {
      this.menuService.setSelectedElement(this.menuService.getElements()[idx]);
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

    const matched = await this.menuService.getOptions().search(searchInput);

    await this.menuService.setElements(matched);

    if (matched.length > 0) {
      this.menuService.setSelectedElement(matched[0]);
    } else {
      this.menuService.setSelectedElement(null);
    }
  }

  async handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.menuService.getSelectedElement();

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
        this.window.moveUp();
        break;
      case "ArrowDown":
        this.window.moveDown();
        break;
      case "Tab":
        if (this.menuService.getOptions().context === Context.Popup) {
          e.preventDefault();
          next_location(e.shiftKey ? -1 : 1);
        }
        break;
    }
  }

  handleResize() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      await this.window.resize();

      const selectedTab = this.menuService.getSelectedElement();

      if (!selectedTab) {
        return;
      }

      this.menuService.setSelectedElement(this.menuService.getElements()[0]);
    }, 100);
  }
}
