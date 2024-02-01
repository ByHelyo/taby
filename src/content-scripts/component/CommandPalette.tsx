import { Combobox, Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import browser from "webextension-polyfill";

function CommandPalette() {
  const [urls, setUrls] = useState<Tab[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function handleBackground(request: MessageFromBackground) {
      console.log("asd");
      if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
        if (!isOpen) {
          setIsOpen(true);
          setUrls(request.tabs || []);
        } else {
          setIsOpen(false);
        }
      } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
        setIsOpen(false);
      }
    }
    browser.runtime.onMessage.addListener(handleBackground);

    return () => {
      browser.runtime.onMessage.removeListener(handleBackground);
    };
  }, []);

  useEffect(() => {
    const fetchUrls = async () => {
      const message: MessageFromScript = {
        type: MessageFromScriptType.REQUEST_SEARCH_TAB,
        search: query,
      };

      return await browser.runtime.sendMessage(message);
    };

    fetchUrls().then(setUrls);
  }, [query]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="fixed inset-0 pt-[25svh] z-50"
      >
        <Dialog.Overlay className="fixed inset-0 bg-gray-500/20" />
        <Combobox
          as="div"
          className="relative bg-white w-[60vw] mx-auto rounded-md shadow-2xl ring-1 ring-black/5 divide-y divide-gray-100"
          onChange={() => {}}
        >
          <div className="flex items-center p-4 gap-2.5">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
            <Combobox.Input
              className="w-full border-0 bg-transparent outline-none text-lg text-gray-800 placeholder:text-gray-400"
              placeholder="Search ..."
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>
          <Combobox.Options
            static
            className="max-h-[60svh] p-2 text-sm overflow-y-auto"
          >
            {urls.map((url) => {
              return (
                <Combobox.Option value={url} key={url.key}>
                  {({ active }) => {
                    return (
                      <div
                        className={`flex p-1.5 gap-4 rounded ${active ? "bg-neutral-100" : "bg-white"}`}
                      >
                        <span className="flex-shrink-0 w-5 flex justify-end font-bold">
                          {url.key}
                        </span>
                        <img
                          className="w-5 h-5"
                          src={url.favIconUrl}
                          alt="icon"
                        />
                        <span>{url.title}</span>
                      </div>
                    );
                  }}
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        </Combobox>
      </Dialog>
    </div>
  );
}

export default CommandPalette;
