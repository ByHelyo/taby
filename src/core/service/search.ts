import browser from "webextension-polyfill";

import {
  MessageFromScript,
  MessageFromScriptType,
} from "../../type/message.ts";

export async function search_open_tabs<T>(content: string): Promise<T[]> {
  const message: MessageFromScript<T> = {
    type: MessageFromScriptType.REQUEST_SEARCH_OPEN_TABS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_bookmarks<T>(content: string): Promise<T[]> {
  const message: MessageFromScript<T> = {
    type: MessageFromScriptType.REQUEST_SEARCH_BOOKMARKS,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}

export async function search_history<T>(content: string): Promise<T[]> {
  const message: MessageFromScript<T> = {
    type: MessageFromScriptType.REQUEST_SEARCH_HISTORY,
    search: content,
  };

  return await browser.runtime.sendMessage(message);
}
