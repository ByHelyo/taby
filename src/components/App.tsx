import { EContext, EPopupWindow, ESelectedGroup } from "../type/misc.ts";
import Navigation from "./Navigation.tsx";
import useSettings from "~/hook/useSettings.ts";
import { useEffect } from "react";
import { useGroup } from "~/hook/useGroup.ts";
import Settings from "./Settings.tsx";
import BookmarkCommand from "./bookmark/BookmarkCommand.tsx";
import HistoryCommand from "./history/HistoryCommand.tsx";
import TabCommand from "./tab/TabCommand.tsx";

interface AppProps {
  context: EContext;
}

function App({ context }: AppProps) {
  const {
    theme,
    popupFixed,
    positionInline,
    positionBlock,
    scroll,
    commandPaletteWidth,
  } = useSettings();
  const { group, setGroup, prevGroup, nextGroup } = useGroup(
    ESelectedGroup.Tab,
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = async (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        if (context === EContext.Popup) {
          e.preventDefault();
          prevGroup();
        }
        break;
      case "ArrowRight":
        if (context === EContext.Popup) {
          e.preventDefault();
          nextGroup();
        }
        break;
      case "Tab":
        if (context === EContext.Popup) {
          e.preventDefault();
          if (e.shiftKey) {
            prevGroup();
          } else {
            nextGroup();
          }
        }
        break;
    }
  };

  return (
    <div className="taby-theme" data-theme={theme}>
      <div
        className="flex flex-col text-foreground bg-background"
        style={{
          height:
            (context === EContext.Popup && popupFixed === EPopupWindow.Fixed) ||
            group === ESelectedGroup.Settings
              ? "600px"
              : "auto",
        }}
      >
        {group === ESelectedGroup.Tab && (
          <TabCommand
            placeholder="Search open tabs"
            context={context}
            positionBlock={positionBlock}
            positionInline={positionInline}
            scroll={scroll}
            commandPaletteWidth={commandPaletteWidth}
          />
        )}
        {group === ESelectedGroup.Bookmarks && (
          <BookmarkCommand
            placeholder="Search bookmarks"
            context={context}
            positionBlock={positionBlock}
            positionInline={positionInline}
            scroll={scroll}
            commandPaletteWidth={commandPaletteWidth}
          />
        )}
        {group === ESelectedGroup.History && (
          <HistoryCommand
            placeholder="Search history"
            context={context}
            positionBlock={positionBlock}
            positionInline={positionInline}
            scroll={scroll}
            commandPaletteWidth={commandPaletteWidth}
          />
        )}
        {group === ESelectedGroup.Settings && <Settings />}
        {context === EContext.Popup && (
          <Navigation group={group} setGroup={setGroup} />
        )}
      </div>
    </div>
  );
}

export default App;
