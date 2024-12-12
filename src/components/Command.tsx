import CommandResults from "./CommandResults.tsx";
import { ChangeEvent, useEffect, useRef } from "react";
import browser from "webextension-polyfill";
import useRefState from "~/hook/useRefState.ts";
import { cn } from "~/lib/utils.ts";
import { EMessageFromScriptType, TMessageFromScript } from "~/type/message.ts";
import { EContext, EScroll } from "~/type/misc.ts";
import { TTab } from "~/type/tab.tsx";

interface TCommandProps {
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

export interface TGoToOptions {
  newTab: boolean;
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
}: TCommandProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedElement, setSelectedElement] = useRefState<number | null>(0);
  const [elements, setElements] = useRefState<TTab[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    searchFunction("").then(setElements);
    inputRef.current?.focus();
    inputRef.current?.style.setProperty("box-shadow", "none", "important");
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
          await goTo(elements.current[selectedElement.current], {
            newTab: e.ctrlKey,
          });
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
    }, 150);
  };

  const handleOutsideClick = async (e: MouseEvent) => {
    if (!menuRef.current?.contains(e.target as HTMLElement)) {
      setIsOpen(false);
    }
  };

  const goTo = async (tab: TTab, options: TGoToOptions) => {
    setIsOpen(false);
    const message: TMessageFromScript = {
      type: messageType,
      element: tab,
      newTab: options.newTab,
    };

    await browser.runtime.sendMessage(message);

    if (EContext.Popup) {
      window.close();
    }
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        "taby-menu flex flex-col bg-background text-foreground antialiased shadow-2xl ring-1 ring-input",
        context === EContext.ContentScript && "animate-translateYIn",
      )}
      style={{
        width:
          context === EContext.ContentScript
            ? commandPaletteWidth + "%"
            : "auto",
        top: positionBlock + "%",
        left: positionInline + "%",
      }}
    >
      <div className="flex items-center justify-between gap-[16px] p-[14px]">
        <input
          className="!focus:outline-none m-0 flex w-full border-0 bg-background p-0 text-left !font-sans text-[18px] font-normal leading-[27px] text-foreground !placeholder-muted-foreground shadow-none !outline-none"
          placeholder={placeholder}
          ref={inputRef}
          onChange={handleOnChange}
        />
        <span className="shrink-0 !font-sans text-[16px] font-normal leading-[21px] text-muted-foreground">
          {elements.current.length}
        </span>
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
