import { Context, MenuServiceOption } from "../../type/misc.ts";
import { MenuUi } from "../ui/menuUi.ts";
import { Resource } from "../../type/resource.ts";

export class MenuService<T extends Resource> {
  private selectedElement: T | null;
  private elements: T[];
  private display: boolean;
  private readonly menuUi: MenuUi<T>;
  private readonly options: MenuServiceOption<T>;

  constructor(options: MenuServiceOption<T>) {
    this.options = options;
    this.selectedElement = null;
    this.elements = [];
    this.display = false;
    this.menuUi = new MenuUi(this);
  }

  getMenuUi() {
    return this.menuUi;
  }

  getContext() {
    return this.options.context;
  }

  getOptions() {
    return this.options;
  }

  isDisplayed() {
    return this.display;
  }

  async setElements(elements: T[]) {
    this.elements = elements;
    await this.menuUi.setElements();
  }

  getElements() {
    return this.elements;
  }

  setSelectedElement(element: T | null) {
    this.selectedElement = element;

    if (element) {
      this.menuUi.setSelectedElement(element);
    }
  }

  getSelectedElement() {
    return this.selectedElement;
  }

  async open() {
    this.display = true;
    await this.menuUi.displays(true);
  }

  async close() {
    this.display = false;
    await this.menuUi.displays(false);
  }

  async goTo() {
    const selectedElement = this.selectedElement;
    if (!selectedElement) {
      return;
    }

    if (this.options.context === Context.ContentScript) {
      await this.close();
    }

    await this.options.goTo(selectedElement);

    if (this.options.context === Context.Popup) {
      window.close();
    }
  }

  async setupElements() {
    const promise = this.open();
    const elements = await this.options.search("");
    await this.setElements(elements);
    this.setSelectedElement(elements[0]);

    await promise;
  }
}
