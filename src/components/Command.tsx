import CommandResults from "./CommandResults.tsx";
import { ChangeEvent, useEffect, useRef } from "react";
import browser from "webextension-polyfill";
import useRefState from "~/hook/useRefState.ts";
import { EMessageFromScriptType, TMessageFromScript } from "~/type/message.ts";
import { EScroll } from "~/type/misc.ts";
import { TTab } from "~/type/tab.tsx";

interface TCommandProps {
  placeholder: string;
  scroll: EScroll;
  searchFunction: (query: string) => Promise<TTab[]>;
  messageType: EMessageFromScriptType;
}

export interface TGoToOptions {
  newTab: boolean;
}

function Command({
  placeholder,
  scroll,
  searchFunction,
  messageType,
}: TCommandProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedElement, setSelectedElement] = useRefState<number | null>(0);
  const [elements, setElements] = useRefState<TTab[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    searchFunction("").then((matched) => {
      console.log("searchFunction");
      setElements(matched);
    });
    inputRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
        window.close();
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

  const goTo = async (tab: TTab, options: TGoToOptions) => {
    const message: TMessageFromScript = {
      type: messageType,
      element: tab,
      newTab: options.newTab,
    };

    await browser.runtime.sendMessage(message);

    window.close();
  };

  return (
    <div
      ref={menuRef}
      className="taby-menu bg-background! text-foreground ring-input flex flex-col antialiased ring-1"
    >
      <div className="flex items-center justify-between! gap-[16px] p-[14px]">
        <input
          className="bg-background text-foreground placeholder-muted-foreground m-0 flex w-full border-0 p-0 text-left font-sans text-[18px] leading-[27px] font-normal shadow-none outline-hidden focus:outline-none"
          placeholder={placeholder}
          ref={inputRef}
          onChange={handleOnChange}
        />
        <span className="text-muted-foreground shrink-0 font-sans text-[16px] leading-[21px] font-normal">
          {elements.current.length}
        </span>
      </div>
      <CommandResults
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
