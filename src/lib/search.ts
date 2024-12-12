import { TMessageFromScript, EMessageFromScriptType } from "../type/message.ts";
import { TTab } from "../type/tab.tsx";
import browser from "webextension-polyfill";

export async function search_open_tabs(content: string): Promise<TTab[]> {
  const message: TMessageFromScript = {
    type: EMessageFromScriptType.REQUEST_SEARCH_OPEN_TABS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_bookmarks(content: string): Promise<TTab[]> {
  const message: TMessageFromScript = {
    type: EMessageFromScriptType.REQUEST_SEARCH_BOOKMARKS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_history(content: string): Promise<TTab[]> {
  const message: TMessageFromScript = {
    type: EMessageFromScriptType.REQUEST_SEARCH_HISTORY,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}
