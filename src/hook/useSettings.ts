import { EAppearance, EPopupWindow, EScroll, EStorage } from "../type/misc.ts";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function useSettings() {
  const [theme, setTheme] = useState(EAppearance.Light);
  const [popupFixed, setPopupFixed] = useState(EPopupWindow.UnFixed);
  const [scroll, setScroll] = useState<EScroll>(EScroll.Default);

  const handleSettings = async (
    changes: Record<string, browser.Storage.StorageChange>,
  ) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key === EStorage.Appearance) {
        setTheme(newValue as EAppearance);
      } else if (key === EStorage.PopupWindow) {
        setPopupFixed(newValue as EPopupWindow);
      } else if (key === EStorage.Scroll) {
        setScroll(newValue as EScroll);
      }
    }
  };

  useEffect(() => {
    browser.storage.local
      .get([EStorage.Appearance, EStorage.PopupWindow, EStorage.Scroll])
      .then((storage) => {
        setTheme(storage[EStorage.Appearance] as EAppearance);
        setPopupFixed(storage[EStorage.PopupWindow] as EPopupWindow);
        setScroll(storage[EStorage.Scroll] as EScroll);
      });

    browser.storage.onChanged.addListener(handleSettings);

    return () => {
      browser.storage.onChanged.removeListener(handleSettings);
    };
  }, []);

  return {
    theme,
    popupFixed,
    scroll,
  };
}

export default useSettings;
