import { TMessageFromScript, EMessageFromScriptType } from "../type/message.ts";
import { TTab } from "../type/tab.tsx";
import browser from "webextension-polyfill";
import { TBookmark } from "~/type/bookmark.ts";
import { THistory } from "~/type/history.ts";

export async function search_open_tabs(content: string): Promise<TTab[]> {
  const message: TMessageFromScript<TTab> = {
    type: EMessageFromScriptType.REQUEST_SEARCH_OPEN_TABS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_bookmarks(content: string): Promise<TBookmark[]> {
  const message: TMessageFromScript<TBookmark> = {
    type: EMessageFromScriptType.REQUEST_SEARCH_BOOKMARKS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_history(content: string): Promise<THistory[]> {
  const message: TMessageFromScript<THistory> = {
    type: EMessageFromScriptType.REQUEST_SEARCH_HISTORY,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}
