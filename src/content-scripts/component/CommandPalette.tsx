import { Combobox, Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  MessageFromBackground,
  MessageFromBackgroundType,
  MessageFromScript,
  MessageFromScriptType,
  Tab,
} from "../../type/misc.ts";
import browser from "webextension-polyfill";

enum Status {
  Closed,
  Opened,
  Submitted,
}

function CommandPalette() {
  const [status, setStatus] = useState(Status.Closed);
  const [tabs, setTabs] = useState<Tab[]>([]);

  useEffect(() => {
    async function handleBackground(request: MessageFromBackground) {
      if (request.type === MessageFromBackgroundType.TOGGLE_MENU) {
        if (status === Status.Closed) {
          setStatus(Status.Opened);
          setTabs(request.tabs || []);
        } else {
          setStatus(Status.Closed);
        }
      } else if (request.type === MessageFromBackgroundType.USER_SWITCHES_TAB) {
        setStatus(Status.Closed);
      }
    }
    browser.runtime.onMessage.addListener(handleBackground);
    return () => {
      browser.runtime.onMessage.removeListener(handleBackground);
    };
  }, []);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fetchUrls = async (query: string) => {
      const message: MessageFromScript = {
        type: MessageFromScriptType.REQUEST_SEARCH_TAB,
        search: query,
      };

      return await browser.runtime.sendMessage(message);
    };

    fetchUrls(event.target.value).then(setTabs);
  };

  const askSwitchTab = async () => {
    const message: MessageFromScript = {
      type: MessageFromScriptType.REQUEST_SWITCH_TAB,
      tab: tabs[0],
    };
    await browser.runtime.sendMessage(message);
  };

  return (
    <Transition.Root
      show={status === Status.Opened}
      as={Fragment}
      afterLeave={askSwitchTab}
    >
      <Dialog
        onClose={() => setStatus(Status.Closed)}
        className="fixed inset-0 pt-[25svh] z-[10000]"
      >
        <Transition.Child
          enter="duration-100 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            as="div"
            className="relative bg-white w-[60vw] mx-auto rounded-md shadow-2xl ring-1 ring-black/5 divide-y divide-gray-100"
            onChange={async () => {
              setStatus(Status.Submitted);
            }}
          >
            <div className="flex items-center p-3.5 gap-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              <Combobox.Input
                className="w-full outline-none text-lg text-gray-800 placeholder:text-gray-400"
                placeholder="Search ..."
                onChange={handleOnChange}
              />
            </div>

            {tabs.length > 0 && (
              <Combobox.Options
                static
                className="max-h-[60svh] p-2 text-sm overflow-y-auto no-scrollbar"
              >
                {tabs.map((tab, idx) => {
                  return (
                    <Combobox.Option value={tab} key={idx}>
                      {({ active }) => {
                        return (
                          <div
                            className={`flex p-1.5 items-center gap-4 rounded whitespace-nowrap overflow-clip ${active ? "bg-neutral-100" : "bg-white"}`}
                          >
                            <span className="flex-shrink-0 w-5 flex items-center justify-end font-bold text-black">
                              {tab.key}
                            </span>
                            <img
                              className="w-5 h-5"
                              src={tab.favIconUrl}
                              alt="icon"
                            />
                            <span className="flex items-center text-gray-900">
                              {tab.title}
                            </span>
                          </div>
                        );
                      }}
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}

export default CommandPalette;
