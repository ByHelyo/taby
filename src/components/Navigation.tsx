import { cn } from "~/lib/utils.ts";
import { ESelectedGroup } from "~/type/misc.ts";

interface NavigationProps {
  group: ESelectedGroup;
  setGroup: (group: ESelectedGroup) => void;
}

export function Navigation({ group, setGroup }: NavigationProps) {
  const onClick = (group: ESelectedGroup) => {
    setGroup(group);
  };

  return (
    <nav className="pr-4 flex justify-between items-center text-[11px] bg-secondary">
      <div className="flex">
        <button
          onClick={() => onClick(ESelectedGroup.Tab)}
          className={cn(
            "inline-block py-2 px-6",
            group === ESelectedGroup.Tab &&
              "bg-primary text-primary-foreground",
          )}
        >
          Tab
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.Bookmarks)}
          className={cn(
            "inline-block py-2 px-6",
            group === ESelectedGroup.Bookmarks &&
              "bg-primary text-primary-foreground",
          )}
        >
          Bookmarks
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.History)}
          className={cn(
            "inline-block py-2 px-6",
            group === ESelectedGroup.History &&
              "bg-primary text-primary-foreground",
          )}
        >
          History
        </button>
        <button
          onClick={() => onClick(ESelectedGroup.Settings)}
          className={cn(
            "inline-block py-2 px-6",
            group === ESelectedGroup.Settings &&
              "bg-primary text-primary-foreground",
          )}
        >
          Settings
        </button>
      </div>
      <div>Use Shift+Tab/Tab or Left/Right arrows to move left/right</div>
    </nav>
  );
}

export default Navigation;
