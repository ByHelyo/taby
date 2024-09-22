import { ChangeEvent, useEffect, useRef, useState } from "react";
import browser from "webextension-polyfill";
import {
  EMessageFromBackgroundType,
  EMessageFromScriptType,
  TMessageFromBackground,
  TMessageFromScript,
} from "~/type/message.ts";
import { search_bookmarks } from "~/lib/search.ts";
import { EContext, EScroll } from "~/type/misc.ts";
import useRefState from "~/hook/useRefState.ts";
import BookmarkResults from "./BookmarkResults.tsx";
import { TBookmark } from "~/type/bookmark.ts";

interface BookmarkCommandProps {
  placeholder: string;
  context: EContext;
  positionBlock: string;
  positionInline: string;
  scroll: EScroll;
  commandPaletteWidth: string;
}

function BookmarkCommand({
  placeholder,
  context,
  positionBlock,
  positionInline,
  scroll,
  commandPaletteWidth,
}: BookmarkCommandProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useRefState<number | null>(
    null,
  );
  const [elements, setElements] = useRefState<TBookmark[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (context === EContext.Popup) {
      search_bookmarks("").then(setElements);
      setSelectedElement(0);
    }
  }, [context]);

  useEffect(() => {
    const handleBackground = async (request: unknown) => {
      const message = request as TMessageFromBackground;
      if (message.type === EMessageFromBackgroundType.TOGGLE_MENU) {
        if (isOpen) {
          setIsOpen(false);
          setInputValue("");
        } else {
          setIsOpen(true);
          setElements(await search_bookmarks(""));
          setSelectedElement(0);
        }
      } else if (
        message.type === EMessageFromBackgroundType.USER_SWITCHES_TAB
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || context === EContext.Popup) {
      inputRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      if (isOpen || context === EContext.Popup) {
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", handleOutsideClick);
      }
    };
  }, [isOpen]);

  const handleKeyDown = async (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        if (selectedElement.current != null) {
          e.preventDefault();
          await goTo(elements.current[selectedElement.current]);
        }
        break;
      case "Escape":
        e.preventDefault();
        if (context === EContext.Popup) {
          window.close();
        } else {
          setIsOpen(false);
        }
        break;
    }
  };

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const matched = await search_bookmarks(e.target.value);
    setElements(matched);
    if (elements.current.length > 0) {
      setSelectedElement(0);
    } else {
      setSelectedElement(null);
    }
  };

  const handleOutsideClick = async (e: MouseEvent) => {
    if (!menuRef.current?.contains(e.target as HTMLElement)) {
      setIsOpen(false);
    }
  };

  const goTo = async (tab: TBookmark) => {
    setIsOpen(false);
    const message: TMessageFromScript<TBookmark> = {
      type: EMessageFromScriptType.REQUEST_UPDATE_CURRENT_TAB,
      element: tab,
    };

    await browser.runtime.sendMessage(message);

    if (EContext.Popup) {
      window.close();
    }
  };

  return (
    <div
      ref={menuRef}
      className="taby-menu bg-background text-foreground"
      style={{
        width:
          context === EContext.ContentScript
            ? commandPaletteWidth + "%"
            : "auto",
        top: positionBlock + "%",
        left: positionInline + "%",
        display: context === EContext.Popup || isOpen ? "flex" : "none",
      }}
    >
      <div className="taby-search">
        <img
          className="taby-glass"
          src={browser.runtime.getURL("image/glass.svg")}
          alt="glass"
        />
        <input
          className="taby-searchInput placeholder-muted-foreground"
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
          onChange={handleOnChange}
        />
      </div>
      <BookmarkResults
        context={context}
        elements={elements}
        setSelectedElement={setSelectedElement}
        setIsOpen={setIsOpen}
        selectedElement={selectedElement}
        goTo={goTo}
        scroll={scroll}
      />
    </div>
  );
}

export default BookmarkCommand;
