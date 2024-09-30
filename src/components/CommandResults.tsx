import { computeWindowSize, moveDown, moveUp } from "../lib/window.ts";
import { TTab } from "../type/tab.tsx";
import { MutableRefObject, useEffect, useRef } from "react";
import useRefState from "~/hook/useRefState.ts";
import { cn } from "~/lib/utils.ts";
import { EContext, EScroll } from "~/type/misc.ts";

interface TabResultsProps {
  elements: MutableRefObject<TTab[]>;
  context: EContext;
  selectedElement: MutableRefObject<number | null>;
  setSelectedElement: (idx: number) => void;
  goTo: (tab: TTab) => Promise<void>;
  scroll: EScroll;
}

function CommandResults({
  context,
  elements,
  selectedElement,
  setSelectedElement,
  goTo,
  scroll,
}: TabResultsProps) {
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
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleOnWheel);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = async (idx: number) => {
    if (selectedElement.current !== null && selectedElement.current === idx) {
      await goTo(elements.current[selectedElement.current]);
    } else {
      setSelectedElement(idx);
    }
  };

  return (
    <>
      {elements.current.length > 0 && (
        <ul className="taby-searchList border-0 border-t-2 border-solid border-input/50">
          {elements.current.slice(start.current, end.current).map((element) => (
            <div
              key={element.idx}
              className={cn(
                "taby-searchItem",
                selectedElement.current !== null &&
                  element.idx === selectedElement.current &&
                  "bg-secondary",
              )}
              onClick={() => handleOnClick(element.idx)}
            >
              {element.key != null && (
                <span className="taby-searchKey">{element.key}</span>
              )}
              {element.favIconUrl != null && (
                <img
                  src={element.favIconUrl}
                  className="taby-searchImg"
                  alt=""
                />
              )}
              <span className="taby-searchTitle">{element.title}</span>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default CommandResults;