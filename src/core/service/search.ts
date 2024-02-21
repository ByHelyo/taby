import browser from "webextension-polyfill";
import { MessageFromScript, MessageFromScriptType } from "../../type/misc.ts";
import { Tab } from "../../type/tab.ts";

export async function search_open_tabs(content: string): Promise<Tab[]> {
  const message: MessageFromScript = {
    type: MessageFromScriptType.REQUEST_SEARCH_OPEN_TAB,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_bookmarks(content: string) {
  if (content) return [];
  return [];
}
