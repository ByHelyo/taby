import { Bookmarks } from "webextension-polyfill";
import BookmarkTreeNode = Bookmarks.BookmarkTreeNode;

export function bfs_bookmark(root: BookmarkTreeNode[]): BookmarkTreeNode[] {
  const q = root;
  const bookmarks: BookmarkTreeNode[] = [];

  while (q.length > 0) {
    const node = q.pop();

    if (!node) {
      continue;
    }

    if (node.url) {
      bookmarks.push(node);
    }

    if (node.children) {
      for (const child of node.children) {
        q.push(child);
      }
    }
  }

  return bookmarks;
}
