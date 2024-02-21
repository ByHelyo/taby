import { MenuDom } from "../dom/menuDom.ts";
import { MenuService } from "../service/menuService.ts";
import { Action, WindowService } from "../service/window.ts";
import { Context } from "../../type/misc.ts";
import { Resource } from "../../type/resource.ts";

export class MenuUi<T extends Resource> {
  dom: MenuDom<T>;
  menuService: MenuService<T>;
  window: WindowService<T>;
  timeout: number | undefined;

  constructor(menuService: MenuService<T>, window: WindowService<T>) {
    this.menuService = menuService;
    this.dom = new MenuDom(menuService);
    this.window = window;

    this.dom.onInput(async (e) => {
      await this.handleOnInput(e);
    });

    if (menuService.getContext() === Context.ContentScript) {
      this.dom.onKeyDown(async (e) => {
        await this.handleOnKeyDown(e);
      });
    }
  }

  async setElements(elements: T[], start?: number, end?: number) {
    this.window.setSize(elements.length);

    this.dom.clearList();

    if (elements.length === 0) {
      this.dom.hideResults();
      return;
    }

    this.dom.displayResults();

    if (start && end) {
      this.dom.addItems(elements.slice(start, end), (idx: number) => {
        this.handleOnClick(idx);
      });
    } else {
      this.dom.addItems(
        elements.slice(0, this.window.getEnd()),
        (idx: number) => {
          this.handleOnClick(idx);
        },
      );
    }
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
        await this.moveUp();
        break;
      case "ArrowDown":
        await this.moveDown();
        break;
    }
  }

  async moveUp() {
    const selectedTab = this.menuService.getSelectedElement();
    if (!selectedTab) {
      return;
    }

    const elements = this.menuService.getElements();
    const next = this.window.moveUp(selectedTab.idx);

    switch (next.action) {
      case Action.MovedToEnd:
        await this.setElements(
          this.menuService.getElements(),
          next.start,
          next.end,
        );
        break;
      case Action.MovedUp:
        if (this.window.getCapacity() > 0) {
          this.dom.removeItem(elements[next.end].idx);
          this.dom.pushItem(elements[next.start], (idx) =>
            this.handleOnClick(idx),
          );
        }
        break;
    }

    this.menuService.setSelectedElement(
      this.menuService.getElements()[next.next],
    );
  }

  async moveDown() {
    const selectedTab = this.menuService.getSelectedElement();
    if (!selectedTab) {
      return;
    }
    const elements = this.menuService.getElements();
    const next = this.window.moveDown(selectedTab.idx);

    switch (next.action) {
      case Action.MovedToStart:
        await this.setElements(
          this.menuService.getElements(),
          next.start,
          next.end,
        );
        break;
      case Action.MovedDown:
        if (this.window.getCapacity() > 0) {
          this.dom.removeItem(elements[next.start].idx);
          this.dom.addItem(elements[next.end], (idx) =>
            this.handleOnClick(idx),
          );
        }
        break;
    }

    this.menuService.setSelectedElement(
      this.menuService.getElements()[next.next],
    );
  }

  handleResize() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      this.window.resize();

      await this.setElements(
        this.menuService.getElements(),
        this.window.getStart(),
        this.window.getEnd(),
      );

      const selectedTab = this.menuService.getSelectedElement();

      if (!selectedTab) {
        return;
      }

      this.menuService.setSelectedElement(this.menuService.getElements()[0]);
    }, 100);
  }
}
