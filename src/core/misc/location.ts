const PATHS = ["/src/popup/popup.html", "/src/popup/bookmark/bookmark.html"];

export function next_location(steps: number) {
  const index =
    (PATHS.indexOf(window.location.pathname) + steps + PATHS.length) %
    PATHS.length;

  window.location.pathname = PATHS[index];
}
