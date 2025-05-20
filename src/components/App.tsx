import { EContext, EPopupWindow, ESelectedGroup } from "../type/misc.ts";
import Command from "./Command.tsx";
import Navigation from "./Navigation.tsx";
import Settings from "./Settings.tsx";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { useGroup } from "~/hook/useGroup.ts";
import useSettings from "~/hook/useSettings.ts";
import {
  search_bookmarks,
  search_history,
  search_open_tabs,
} from "~/lib/search.ts";
import {
  EMessageFromBackgroundType,
  EMessageFromScriptType,
  TMessageFromBackground,
} from "~/type/message.ts";

interface TAppProps {
  context: EContext;
}

function App({ context }: TAppProps) {
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleBackground = async (request: unknown) => {
      const message = request as TMessageFromBackground;
      if (message.type === EMessageFromBackgroundType.TOGGLE_MENU) {
        setIsOpen(!isOpen);
      } else if (
        message.type === EMessageFromBackgroundType.USER_SWITCHES_TAB &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    if (context === EContext.ContentScript) {
      browser.runtime.onMessage.addListener(handleBackground);
    }
    return () => {
      if (context === EContext.ContentScript) {
        browser.runtime.onMessage.removeListener(handleBackground);
      }
    };
  }, [context, isOpen]);

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

    if (isOpen || context === EContext.Popup) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (isOpen || context === EContext.Popup) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isOpen, context, prevGroup, nextGroup]);

  return (
    <div className="taby-theme" data-theme={theme}>
      <div
        className="bg-background! text-foreground! flex! flex-col!"
        style={{
          height:
            (context === EContext.Popup && popupFixed === EPopupWindow.Fixed) ||
            group === ESelectedGroup.Settings
              ? "600px"
              : "auto",
        }}
      >
        {(context === EContext.Popup || isOpen) && (
          <>
            {group === ESelectedGroup.Tab && (
              <Command
                setIsOpen={setIsOpen}
                searchFunction={search_open_tabs}
                messageType={EMessageFromScriptType.REQUEST_SWITCH_TAB}
                placeholder="Search open tabs"
                context={context}
                positionBlock={positionBlock}
                positionInline={positionInline}
                scroll={scroll}
                commandPaletteWidth={commandPaletteWidth}
              />
            )}
            {group === ESelectedGroup.Bookmarks && (
              <Command
                setIsOpen={setIsOpen}
                searchFunction={search_bookmarks}
                messageType={EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB}
                placeholder="Search bookmarks"
                context={context}
                positionBlock={positionBlock}
                positionInline={positionInline}
                scroll={scroll}
                commandPaletteWidth={commandPaletteWidth}
              />
            )}
            {group === ESelectedGroup.History && (
              <Command
                setIsOpen={setIsOpen}
                searchFunction={search_history}
                messageType={EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB}
                placeholder="Search history"
                context={context}
                positionBlock={positionBlock}
                positionInline={positionInline}
                scroll={scroll}
                commandPaletteWidth={commandPaletteWidth}
              />
            )}
          </>
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
