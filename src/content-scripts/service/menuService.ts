import {
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import { MenuRepository } from "../repository/menuRepository.ts";
import browser from "webextension-polyfill";

export class MenuService {
  selectedTab: Tab | null;
  tabs: Tab[];
  displayedTabs: Tab[];
  menuRepository: MenuRepository;
  display: boolean;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.displayedTabs = [];
    this.display = false;
    this.menuRepository = new MenuRepository();
    this.menuRepository.onInput((e) => this.handleOnInput(e));
    this.menuRepository.onKeyDown((e) => this.handleOnKeyDown(e));
  }

  setTabs(tabs: Tab[]) {
    this.tabs = tabs;
  }

  getTabs(): Tab[] {
    return this.tabs;
  }

  setDisplayedTabs(tabs: Tab[]) {
    this.displayedTabs = tabs;
    this.menuRepository.setSearchList(tabs, (internalIndex: number) =>
      this.handleOnClick(internalIndex),
    );
  }

  getDisplayedTabs(): Tab[] {
    return this.displayedTabs;
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  setSelectedTab(tab: Tab | null) {
    this.selectedTab = tab;
    if (tab) {
      this.menuRepository.selectSearchList(tab);
    }
  }

  isDisplayed(): boolean {
    return this.display;
  }

  openMenu() {
    this.display = true;
    this.menuRepository.openMenu();
  }

  closeMenu() {
    this.menuRepository.displays(false);
    this.display = false;
  }

  moveUp() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }

    const n = this.getDisplayedTabs().length;
    const nextIndex = (selectedTab.internalIndex - 1 + n) % n;

    this.setSelectedTab(this.getDisplayedTabs()[nextIndex]);
  }

  moveDown() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getDisplayedTabs().length;
    const nextIndex = (selectedTab.internalIndex + 1) % n;

    this.setSelectedTab(this.getDisplayedTabs()[nextIndex]);
  }

  goToTab(tab: Tab) {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SWITCH_TAB,
      tab: tab,
    };

    this.closeMenu(); /* Close menu */
    browser.runtime.sendMessage(message);
  }

  async searchTabs(content: string): Promise<Tab[]> {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SEARCH_TAB,
      search: content,
    };

    return await browser.runtime.sendMessage(message);
  }

  handleOnKeyDown(e: KeyboardEvent) {
    const selectedTab = this.getSelectedTab();

    switch (e.key) {
      case "Enter":
        if (selectedTab !== null) {
          this.goToTab(selectedTab);
        }
        break;
      case "Escape":
        this.closeMenu();
        break;
      case "ArrowUp":
        this.moveUp();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
    }
  }

  async handleOnInput(e: Event) {
    const searchInput = (<HTMLInputElement>e.target).value;

    if (searchInput === "") {
      this.setDisplayedTabs(this.getTabs());
      this.setSelectedTab(this.getTabs()[0]);
      return;
    }

    const matched = await this.searchTabs(searchInput);

    this.setDisplayedTabs(matched);

    if (matched.length > 0) {
      this.setSelectedTab(matched[0]);
    } else {
      this.setSelectedTab(null);
    }
  }

  handleOnClick(internalIndex: number) {
    const selectedTab = this.getSelectedTab();
    if (
      selectedTab &&
      this.getSelectedTab() === this.getDisplayedTabs()[internalIndex]
    ) {
      this.goToTab(selectedTab);
    } else {
      this.setSelectedTab(this.getDisplayedTabs()[internalIndex]);
    }
  }
}
