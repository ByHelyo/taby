export const within = function (
  num: number,
  start: number,
  end: number,
): boolean {
  return num < start || num >= end;
};
