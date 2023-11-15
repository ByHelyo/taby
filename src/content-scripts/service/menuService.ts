import {
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import { MenuRepository } from "../repository/menuRepository.ts";
import browser from "webextension-polyfill";
import { within } from "./misc.ts";

const SEARCH_INPUT_SIZE: number = 60;
const PADDINGS_SEARCH_LIST: number = 16;
const SEARCH_ITEM_SIZE: number = 40;

export class MenuService {
  selectedTab: Tab | null;
  tabs: Tab[];
  displayedTabs: Tab[];
  menuRepository: MenuRepository;
  display: boolean;
  size: number;
  window_left: number;
  window_right: number;

  constructor() {
    this.selectedTab = null;
    this.tabs = [];
    this.displayedTabs = [];
    this.display = false;
    this.menuRepository = new MenuRepository();
    this.menuRepository.onInput((e) => this.handleOnInput(e));
    this.menuRepository.onKeyDown((e) => this.handleOnKeyDown(e));
    const menu_max_size =
      window.innerHeight * 0.7 - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST;
    this.size = Math.floor(menu_max_size / SEARCH_ITEM_SIZE);
    this.window_left = 0;
    this.window_right = this.size;
  }

  setTabs(tabs: Tab[]) {
    this.tabs = tabs;
  }

  getTabs(): Tab[] {
    return this.tabs;
  }

  setDisplayedTabs(tabs: Tab[], start?: number, end?: number) {
    this.displayedTabs = tabs;

    if (start && end) {
      this.menuRepository.setSearchList(
        tabs.slice(start, end),
        (internalIndex: number) => this.handleOnClick(internalIndex),
      );
    } else {
      this.menuRepository.setSearchList(
        tabs.slice(0, this.size),
        (internalIndex: number) => this.handleOnClick(internalIndex),
      );
    }
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

    if (within(nextIndex, this.window_left, this.window_right)) {
      const tabs = this.getDisplayedTabs();

      if (nextIndex == n - 1) {
        this.window_left = n - this.size;
        this.window_right = n;
        this.setDisplayedTabs(
          this.getTabs(),
          this.window_left,
          this.window_right,
        );
      } else {
        --this.window_left;
        --this.window_right;
        this.menuRepository.moveWindowUp(
          tabs[this.window_left],
          tabs[this.window_right],
          (internalIndex: number) => this.handleOnClick(internalIndex),
        );
      }
    }

    this.setSelectedTab(this.getDisplayedTabs()[nextIndex]);
  }

  moveDown() {
    const selectedTab = this.getSelectedTab();
    if (!selectedTab) {
      return;
    }
    const n = this.getDisplayedTabs().length;
    const nextIndex = (selectedTab.internalIndex + 1) % n;

    if (within(nextIndex, this.window_left, this.window_right)) {
      const tabs = this.getDisplayedTabs();

      if (nextIndex == 0) {
        this.window_left = 0;
        this.window_right = this.size;
        this.setDisplayedTabs(this.getTabs());
      } else {
        this.menuRepository.moveWindowDown(
          tabs[this.window_left],
          tabs[this.window_right],
          (internalIndex: number) => this.handleOnClick(internalIndex),
        );
        ++this.window_left;
        ++this.window_right;
      }
    }
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
