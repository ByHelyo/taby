import {
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import { MenuUi } from "../ui/menuUi.ts";
import browser from "webextension-polyfill";
import { nextFrame } from "../misc/animation.ts";

export class MenuService {
  selectedTab: Tab | null;
  tabs: Tab[];
  display: boolean;
  menuUi: MenuUi;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.display = false;
    this.menuUi = new MenuUi(this);
  }

  getMenuUi() {
    return this.menuUi;
  }

  isDisplayed() {
    return this.display;
  }

  setTabs(tabs: Tab[]) {
    this.tabs = tabs;
    this.menuUi.setTabs(tabs);
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

  open() {
    this.display = true;
    this.menuUi.displays(true);
  }

  close() {
    this.menuUi.displays(false);
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

    this.close();
    await nextFrame();
    browser.runtime.sendMessage(message);
  }

  async search(content: string): Promise<Tab[]> {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SEARCH_TAB,
      search: content,
    };

    return await browser.runtime.sendMessage(message);
  }
}
