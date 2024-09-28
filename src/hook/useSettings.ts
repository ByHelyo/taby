import { EAppearance, EPopupWindow, EScroll, EStorage } from "../type/misc.ts";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function useSettings() {
  const [theme, setTheme] = useState(EAppearance.Light);
  const [popupFixed, setPopupFixed] = useState(EPopupWindow.UnFixed);
  const [positionInline, setPositionInline] = useState("0");
  const [positionBlock, setPositionBlock] = useState("0");
  const [scroll, setScroll] = useState<EScroll>(EScroll.Default);
  const [commandPaletteWidth, setCommandPaletteWidth] = useState("0");

  const handleSettings = async (
    changes: Record<string, browser.Storage.StorageChange>,
  ) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === EStorage.Appearance) {
        setTheme(newValue as EAppearance);
      } else if (key === EStorage.PopupWindow) {
        setPopupFixed(newValue as EPopupWindow);
      } else if (key === EStorage.PositionInline) {
        setPositionInline(newValue as string);
      } else if (key === EStorage.PositionBlock) {
        setPositionBlock(newValue as string);
      } else if (key === EStorage.Scroll) {
        setScroll(newValue as EScroll);
      } else if (key === EStorage.CommandPaletteWidth) {
        setCommandPaletteWidth(newValue as string);
      }
    }
  };

  useEffect(() => {
    browser.storage.local
      .get([
        EStorage.Appearance,
        EStorage.PopupWindow,
        EStorage.PositionInline,
        EStorage.PositionBlock,
        EStorage.Scroll,
        EStorage.CommandPaletteWidth,
      ])
      .then((storage) => {
        setTheme(storage[EStorage.Appearance] as EAppearance);
        setPopupFixed(storage[EStorage.PopupWindow] as EPopupWindow);
        setPositionInline(storage[EStorage.PositionInline] as string);
        setPositionBlock(storage[EStorage.PositionBlock] as string);
        setScroll(storage[EStorage.Scroll] as EScroll);
        setCommandPaletteWidth(storage[EStorage.CommandPaletteWidth] as string);
      });

    browser.storage.onChanged.addListener(handleSettings);

    return () => {
      browser.storage.onChanged.removeListener(handleSettings);
    };
  }, []);

  return {
    theme,
    popupFixed,
    positionInline,
    positionBlock,
    scroll,
    commandPaletteWidth,
  };
}

export default useSettings;
