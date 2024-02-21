import browser from "webextension-polyfill";
import {
  MessageFromScript,
  MessageFromScriptType,
} from "../../type/message.ts";

export async function goToTab<T>(element: T) {
  const message: MessageFromScript<T> = {
    type: MessageFromScriptType.REQUEST_SWITCH_TAB,
    element: element,
  };
  await browser.runtime.sendMessage(message);
}

export async function goToBookmark<T>(element: T) {
  const message: MessageFromScript<T> = {
    type: MessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB,
    element: element,
  };
  await browser.runtime.sendMessage(message);
}
