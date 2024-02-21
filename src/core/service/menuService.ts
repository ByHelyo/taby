import {
  Context,
  MenuServiceOption,
  MessageFromScript,
  MessageFromScriptType,
} from "../../type/misc.ts";
import { MenuUi } from "../ui/menuUi.ts";
import browser from "webextension-polyfill";
import { WindowService } from "./window.ts";
import { Tab } from "../../type/tab.ts";

export class MenuService {
  private selectedTab: Tab | null;
  private tabs: Tab[];
  private display: boolean;
  private readonly menuUi: MenuUi;
  private readonly options: MenuServiceOption;

  constructor(options: MenuServiceOption) {
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

  isDisplayed() {
    return this.display;
  }

  async setTabs(tabs: Tab[]) {
    this.tabs = tabs;
    await this.menuUi.setTabs(tabs);
  }

  getTabs() {
    return this.tabs;
  }

  setSelectedTab(tab: Tab | null) {
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

    const message: MessageFromScript = {
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

  async search(content: string): Promise<Tab[]> {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SEARCH_TAB,
      search: content,
    };

    return await browser.runtime.sendMessage(message);
  }

  async setupTabs() {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SEARCH_TAB,
      search: "",
    };

    const promise = this.open();
    const tabs = await browser.runtime.sendMessage(message);
    await this.setTabs(tabs);
    this.setSelectedTab(tabs[0]);

    await promise;
  }
}
