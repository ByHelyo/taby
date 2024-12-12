import { Kbd } from "./ui/kbd";
import { cn } from "~/lib/utils.ts";
import { ESelectedGroup } from "~/type/misc.ts";

interface TNavigationProps {
  group: ESelectedGroup;
  setGroup: (group: ESelectedGroup) => void;
}

export function Navigation({ group, setGroup }: TNavigationProps) {
  const onClick = (group: ESelectedGroup) => {
    setGroup(group);
  };

  return (
    <nav className="flex items-center justify-between bg-secondary pr-4 text-[11px]">
      <div className="flex">
        <button
          onClick={() => onClick(ESelectedGroup.Tab)}
          className={cn(
            "inline-block px-6 py-2",
            group === ESelectedGroup.Tab &&
              "bg-primary text-primary-foreground",
          )}
        >
          Tab
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.Bookmarks)}
          className={cn(
            "inline-block px-6 py-2",
            group === ESelectedGroup.Bookmarks &&
              "bg-primary text-primary-foreground",
          )}
        >
          Bookmarks
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.History)}
          className={cn(
            "inline-block px-6 py-2",
            group === ESelectedGroup.History &&
              "bg-primary text-primary-foreground",
          )}
        >
          History
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.Settings)}
          className={cn(
            "inline-block px-6 py-2",
            group === ESelectedGroup.Settings &&
              "bg-primary text-primary-foreground",
          )}
        >
          Settings
        </button>
      </div>
      <div className="flex items-center space-x-1">
        Use <Kbd>Shift</Kbd>+<Kbd>Tab</Kbd> / <Kbd>Tab</Kbd> or <Kbd>←</Kbd> /{" "}
        <Kbd>→</Kbd> to move
      </div>
    </nav>
  );
}

export default Navigation;
