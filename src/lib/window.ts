import browser from "webextension-polyfill";
import { EContext, EStorage } from "../type/misc.ts";
import { MutableRefObject } from "react";

const SEARCH_INPUT_SIZE: number = 55,
  BORDER_SIZE: number = 2,
  PADDINGS_SEARCH_LIST: number = 16,
  SEARCH_ITEM_SIZE: number = 33,
  NAV_POPUP: number = 30;

export const computeWindowSize = async (context: EContext) => {
  const storage = await browser.storage.local.get([EStorage.PositionBlock]);

  const position_block = 1 - Number(storage[EStorage.PositionBlock]) * 0.01;

  const window_size =
    context === EContext.ContentScript
      ? window.innerHeight * position_block
      : 600 - NAV_POPUP;

  const menu_size =
    window_size - SEARCH_INPUT_SIZE - PADDINGS_SEARCH_LIST - BORDER_SIZE;
  const capacity = Math.floor(menu_size / SEARCH_ITEM_SIZE);

  return context == EContext.ContentScript ? Math.min(10, capacity) : capacity;
};

export function moveUp(
  idx: number,
  size: number,
  capacity: number,
  start: MutableRefObject<number>,
  end: MutableRefObject<number>,
  setElement: (value: number) => void,
) {
  const next = (idx - 1 + size) % size;
  if (next === start.current - 1) {
    start.current = start.current - 1;
    end.current = end.current - 1;
  } else if (next == size - 1) {
    start.current = Math.max(size - capacity, 0);
    end.current = size;
  }

  setElement(next);
}

export function moveDown(
  idx: number,
  size: number,
  capacity: number,
  start: MutableRefObject<number>,
  end: MutableRefObject<number>,
  setElement: (value: number) => void,
) {
  const next = (idx + 1) % size;

  if (next === end.current) {
    start.current = start.current + 1;
    end.current = end.current + 1;
  } else if (next == 0) {
    start.current = 0;
    end.current = Math.min(size, capacity);
  }

  setElement(next);
}
