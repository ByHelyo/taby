import { computeWindowSize, moveDown, moveUp } from "../lib/window.ts";
import { TTab } from "../type/tab.tsx";
import { RefObject, useEffect, useRef } from "react";
import { TGoToOptions } from "~/components/Command.tsx";
import useRefState from "~/hook/useRefState.ts";
import { cn } from "~/lib/utils.ts";
import { EContext, EScroll } from "~/type/misc.ts";

interface TTabResultsProps {
  elements: RefObject<TTab[]>;
  context: EContext;
  selectedElement: RefObject<number | null>;
  setSelectedElement: (idx: number) => void;
  goTo: (tab: TTab, options: TGoToOptions) => Promise<void>;
  scroll: EScroll;
}

function CommandResults({
  context,
  elements,
  selectedElement,
  setSelectedElement,
  goTo,
  scroll,
}: TTabResultsProps) {
  const [capacity, setCapacity] = useRefState(0);
  const start = useRef(0);
  const end = useRef(0);

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    computeWindowSize(context).then((computedCapacity) => {
      setCapacity(computedCapacity);
      end.current = computedCapacity;
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (selectedElement.current != null) {
            e.preventDefault();
            moveUp(
              selectedElement.current,
              elements.current.length,
              capacity.current,
              start,
              end,
              setSelectedElement,
            );
          }
          break;
        case "ArrowDown":
          if (selectedElement.current != null) {
            e.preventDefault();
            moveDown(
              selectedElement.current,
              elements.current.length,
              capacity.current,
              start,
              end,
              setSelectedElement,
            );
          }
          break;
      }
    };

    const handleResize = async () => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(async () => {
        computeWindowSize(context).then((computedCapacity) => {
          setCapacity(computedCapacity);
          end.current = computedCapacity;
          start.current = 0;
        });
        if (selectedElement.current != null) setSelectedElement(0);
      }, 200);
    };

    const handleOnWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (selectedElement.current != null) {
        if (
          (scroll === EScroll.Default && e.deltaY < 0) ||
          (scroll === EScroll.Reversed && e.deltaY > 0)
        ) {
          moveUp(
            selectedElement.current,
            elements.current.length,
            capacity.current,
            start,
            end,
            setSelectedElement,
          );
        } else {
          moveDown(
            selectedElement.current,
            elements.current.length,
            capacity.current,
            start,
            end,
            setSelectedElement,
          );
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleOnWheel, { passive: false });
    if (context === EContext.ContentScript)
      window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleOnWheel);
      if (context === EContext.ContentScript)
        window.removeEventListener("resize", handleResize);
      clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = async (idx: number, ctrlKey: boolean) => {
    if (selectedElement.current !== null && selectedElement.current === idx) {
      await goTo(elements.current[selectedElement.current], {
        newTab: ctrlKey,
      });
    } else {
      setSelectedElement(idx);
    }
  };

  return (
    <>
      {elements.current.length > 0 && (
        <ul className="taby-searchList border-input/50! m-0 flex h-full list-none flex-col overflow-scroll border-0 border-t-2! border-solid! p-[8px]">
          {elements.current.slice(start.current, end.current).map((element) => (
            <div
              key={element.idx}
              className={cn(
                "flex items-center gap-[16px] overflow-x-clip rounded p-[6px] whitespace-nowrap select-none",
                selectedElement.current !== null &&
                  element.idx === selectedElement.current &&
                  "bg-secondary!",
              )}
              onClick={(e) => handleOnClick(element.idx, e.ctrlKey)}
            >
              {element.key != null && (
                <span
                  className={cn(
                    "text-foreground flex w-[20px] shrink-0 items-center justify-end font-sans! text-[14px] leading-[21px] font-bold",
                    element.idx === selectedElement.current &&
                      "text-secondary-foreground",
                  )}
                >
                  {element.key}
                </span>
              )}
              {element.favIconUrl != null && element.favIconUrl !== "" ? (
                <img
                  src={element.favIconUrl}
                  className="m-0 flex h-[18px] w-[18px] items-center"
                  alt=""
                />
              ) : (
                <div className="h-[18px] w-[18px] shrink-0" />
              )}
              <span
                className={cn(
                  "text-foreground font-sans! text-[14px] leading-[21px] font-normal",
                  element.idx === selectedElement.current &&
                    "text-secondary-foreground",
                )}
              >
                {element.title}
              </span>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default CommandResults;
