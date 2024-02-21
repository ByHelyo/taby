import {
  Context,
  Idx,
  MenuServiceOption,
  MessageFromScript,
  MessageFromScriptType,
} from "../../type/misc.ts";
import { MenuUi } from "../ui/menuUi.ts";
import browser from "webextension-polyfill";
import { WindowService } from "./window.ts";

export class MenuService<T extends Idx> {
  private selectedTab: T | null;
  private tabs: T[];
  private display: boolean;
  private readonly menuUi: MenuUi<T>;
  private readonly options: MenuServiceOption<T>;

  constructor(options: MenuServiceOption<T>) {
    this.options = options;
    this.selectedTab = null;
    this.tabs = [];
    this.display = false;
    const windowService = new WindowService(this);
    this.menuUi = new MenuUi(this, windowService);
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

  async setTabs(tabs: T[]) {
    this.tabs = tabs;
    await this.menuUi.setTabs(tabs);
  }

  getTabs() {
    return this.tabs;
  }

  setSelectedTab(tab: T | null) {
    this.selectedTab = tab;

    if (tab) {
      this.menuUi.setSelectedTab(tab);
    }
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  async open() {
    this.display = true;
    await this.menuUi.displays(true);
  }

  async close() {
    await this.menuUi.displays(false);
    this.display = false;
  }

  async goTo() {
    const selectedTab = this.selectedTab;
    if (!selectedTab) {
      return;
    }

    const message: MessageFromScript<T> = {
      type: MessageFromScriptType.REQUEST_SWITCH_TAB,
      tab: selectedTab,
    };

    if (this.options.context === Context.ContentScript) {
      await this.close();
    }

    await browser.runtime.sendMessage(message);

    if (this.options.context === Context.Popup) {
      window.close();
    }
  }

  async setupTabs() {
    const promise = this.open();
    const tabs = await this.options.search("");
    await this.setTabs(tabs);
    this.setSelectedTab(tabs[0]);

    await promise;
  }
}
