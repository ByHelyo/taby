import { EPopupWindow, ESelectedGroup } from "../type/misc.ts";
import Command from "./Command.tsx";
import Navigation from "./Navigation.tsx";
import Settings from "./Settings.tsx";
import { useEffect } from "react";
import { useGroup } from "~/hook/useGroup.ts";
import useSettings from "~/hook/useSettings.ts";
import {
  search_bookmarks,
  search_history,
  search_open_tabs,
} from "~/lib/search.ts";
import { EMessageFromScriptType } from "~/type/message.ts";

function App() {
  const { theme, popupFixed, scroll } = useSettings();
  const { group, setGroup, prevGroup, nextGroup } = useGroup(
    ESelectedGroup.Tab,
  );

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevGroup();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextGroup();
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            prevGroup();
          } else {
            nextGroup();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [prevGroup, nextGroup]);

  return (
    <div className="taby-theme" data-theme={theme}>
      <div
        className="bg-background! text-foreground! flex! flex-col!"
        style={{
          height:
            popupFixed === EPopupWindow.Fixed ||
            group === ESelectedGroup.Settings
              ? "600px"
              : "auto",
        }}
      >
        {group === ESelectedGroup.Tab && (
          <Command
            searchFunction={search_open_tabs}
            messageType={EMessageFromScriptType.REQUEST_SWITCH_TAB}
            placeholder="Search open tabs"
            scroll={scroll}
          />
        )}
        {group === ESelectedGroup.Bookmarks && (
          <Command
            searchFunction={search_bookmarks}
            messageType={EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB}
            placeholder="Search bookmarks"
            scroll={scroll}
          />
        )}
        {group === ESelectedGroup.History && (
          <Command
            searchFunction={search_history}
            messageType={EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB}
            placeholder="Search history"
            scroll={scroll}
          />
        )}
        {group === ESelectedGroup.Settings && <Settings />}
        <Navigation group={group} setGroup={setGroup} />
      </div>
    </div>
  );
}

export default App;
