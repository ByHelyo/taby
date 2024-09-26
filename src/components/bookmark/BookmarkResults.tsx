import { MutableRefObject, useEffect, useRef } from "react";
import { computeWindowSize, moveDown, moveUp } from "../../lib/window.ts";
import { EContext, EScroll } from "../../type/misc.ts";
import useRefState from "~/hook/useRefState.ts";
import { cn } from "~/lib/utils.ts";
import { TBookmark } from "~/type/bookmark.ts";

interface BookmarkResultsProps {
  elements: MutableRefObject<TBookmark[]>;
  context: EContext;
  selectedElement: MutableRefObject<number | null>;
  setSelectedElement: (idx: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  goTo: (tab: TBookmark) => Promise<void>;
  scroll: EScroll;
}

function BookmarkResults({
  context,
  elements,
  selectedElement,
  setSelectedElement,
  goTo,
  scroll,
}: BookmarkResultsProps) {
  const [capacity, setCapacity] = useRefState(0);
  const start = useRef(0);
  const end = useRef(0);

  let timeout: number | undefined = undefined;

  useEffect(() => {
    computeWindowSize(context).then((computedCapacity) => {
      setCapacity(computedCapacity);
      end.current = computedCapacity;
    });
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleOnWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleOnWheel);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const handleResize = async () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      computeWindowSize(context).then(setCapacity);
      if (selectedElement != null) setSelectedElement(0);
    }, 100);
  };

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

  const handleOnClick = async (idx: number) => {
    if (selectedElement.current !== null && selectedElement.current === idx) {
      await goTo(elements.current[selectedElement.current]);
    } else {
      setSelectedElement(idx);
    }
  };

  const handleOnWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (selectedElement.current !== null) {
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

  return (
    <>
      {elements.current.length > 0 && (
        <ul className="taby-searchList border-0 border-t-2 border-input/50 border-solid">
          {elements.current.slice(start.current, end.current).map((element) => (
            <div
              key={element.idx}
              className={cn(
                "taby-searchItem",
                element.idx === selectedElement.current && "bg-secondary",
              )}
              onClick={() => handleOnClick(element.idx)}
            >
              <span className="taby-searchTitle">{element.title}</span>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default BookmarkResults;
