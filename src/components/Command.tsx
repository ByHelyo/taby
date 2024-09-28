import CommandResults from "./CommandResults.tsx";
import { ChangeEvent, useEffect, useRef } from "react";
import browser from "webextension-polyfill";
import useRefState from "~/hook/useRefState.ts";
import { EMessageFromScriptType, TMessageFromScript } from "~/type/message.ts";
import { EContext, EScroll } from "~/type/misc.ts";
import { TTab } from "~/type/tab.tsx";

interface CommandProps {
  placeholder: string;
  context: EContext;
  positionBlock: string;
  positionInline: string;
  scroll: EScroll;
  commandPaletteWidth: string;
  searchFunction: (query: string) => Promise<TTab[]>;
  messageType: EMessageFromScriptType;
  setIsOpen: (isOpen: boolean) => void;
}

function Command({
  placeholder,
  context,
  positionBlock,
  positionInline,
  scroll,
  commandPaletteWidth,
  searchFunction,
  messageType,
  setIsOpen,
}: CommandProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedElement, setSelectedElement] = useRefState<number | null>(0);
  const [elements, setElements] = useRefState<TTab[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    searchFunction("").then(setElements);
    inputRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      const matched = await searchFunction(e.target.value);
      setElements(matched);
      if (matched.length > 0) {
        setSelectedElement(0);
      } else {
        setSelectedElement(null);
      }
    }, 200);
  };

  const handleOutsideClick = async (e: MouseEvent) => {
    if (!menuRef.current?.contains(e.target as HTMLElement)) {
      setIsOpen(false);
    }
  };

  const goTo = async (tab: TTab) => {
    setIsOpen(false);
    const message: TMessageFromScript = {
      type: messageType,
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
      className="taby-menu flex animate-commandPaletteIn bg-background text-foreground shadow-2xl ring-1 ring-input"
      style={{
        width:
          context === EContext.ContentScript
            ? commandPaletteWidth + "%"
            : "auto",
        top: positionBlock + "%",
        left: positionInline + "%",
      }}
    >
      <div className="taby-search flex items-center justify-between pl-[48px]">
        <input
          className="taby-searchInput placeholder-muted-foreground"
          placeholder={placeholder}
          ref={inputRef}
          onChange={handleOnChange}
        />
        <span className="text-muted-foreground">{elements.current.length}</span>
      </div>
      <CommandResults
        context={context}
        elements={elements}
        setSelectedElement={setSelectedElement}
        selectedElement={selectedElement}
        goTo={goTo}
        scroll={scroll}
      />
    </div>
  );
}

export default Command;
