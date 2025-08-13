import { RefObject } from "react";

export function moveUp(
  idx: number,
  size: number,
  capacity: number,
  start: RefObject<number>,
  end: RefObject<number>,
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
  start: RefObject<number>,
  end: RefObject<number>,
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
