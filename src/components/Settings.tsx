import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import {
  handleSelectAppearance,
  handleSelectPopupWindow,
  handleSelectScroll,
} from "~/lib/storage";
import { EAppearance, EPopupWindow, EStorage, EScroll } from "~/type/misc";

function Settings() {
  const [theme, setTheme] = useState<EAppearance>(EAppearance.Light);
  const [isFixed, setIsFixed] = useState<EPopupWindow>(EPopupWindow.Fixed);
  const [scroll, setScroll] = useState<EScroll>(EScroll.Default);

  useEffect(() => {
    browser.storage.local
      .get([EStorage.Appearance, EStorage.PopupWindow, EStorage.Scroll])
      .then((storage) => {
        setTheme(
          (storage[EStorage.Appearance] as EAppearance) || EAppearance.Light,
        );
        setIsFixed(
          (storage[EStorage.PopupWindow] as EPopupWindow) ||
            EPopupWindow.UnFixed,
        );
        setScroll((storage[EStorage.Scroll] as EScroll) || EScroll.Default);
      });
  }, []);

  const updateTheme = async (value: EAppearance) => {
    setTheme(value);
    await handleSelectAppearance(value);
  };

  const updateIsFixed = async (value: EPopupWindow) => {
    setIsFixed(value);
    await handleSelectPopupWindow(value);
  };

  const updateScroll = async (value: EScroll) => {
    setScroll(value);
    await handleSelectScroll(value);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        <h1 className="text-xl font-bold">General</h1>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="theme-select">Theme</Label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => updateTheme(e.target.value as EAppearance)}
              className="border-input bg-background ring-offset-background focus:ring-ring w-[180px] rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
            >
              <option value={EAppearance.Light}>Light</option>
              <option value={EAppearance.Dark}>Dark</option>
              <option value={EAppearance.DeepCharcoal}>Deep Charcoal</option>
              <option value={EAppearance.MidnightBlue}>Midnight Blue</option>
              <option value={EAppearance.VioletAbyss}>Violet Abyss</option>
            </select>
          </div>
          <p className="text-muted-foreground text-sm">
            Choose between light and dark mode for the application interface.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="scroll-select">Scroll Behavior</Label>
            <select
              id="scroll-select"
              value={scroll}
              onChange={(e) => updateScroll(e.target.value as EScroll)}
              className="border-input bg-background ring-offset-background focus:ring-ring w-[180px] rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
            >
              <option value={EScroll.Default}>Default</option>
              <option value={EScroll.Reversed}>Reversed</option>
            </select>
          </div>
          <p className="text-muted-foreground text-sm">
            Choose the scrolling behavior for the application.
          </p>
        </div>

        <Separator />

        <h1 className="text-xl font-bold">Popup</h1>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fixed-mode">Fixed Popup</Label>
            <Switch
              id="fixed-mode"
              checked={isFixed === EPopupWindow.Fixed}
              onCheckedChange={(checked) => {
                updateIsFixed(
                  checked ? EPopupWindow.Fixed : EPopupWindow.UnFixed,
                );
              }}
            />
          </div>
          <p className="text-muted-foreground text-sm">
            Fixed displays the popup at its maximum size. Floating displays the
            popup at its minimum size.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}

export default Settings;
