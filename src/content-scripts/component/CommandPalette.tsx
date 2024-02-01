import { Combobox, Dialog } from "@headlessui/react";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function CommandPalette() {
  const urls = ["asd", "asd", "asd"];
  const [isOpen, setIsOpen] = useState(true);
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
              onChange={() => {}}
            />
          </div>
          <Combobox.Options
            static
            className="max-h-[60svh] p-2 text-sm overflow-y-auto"
          >
            {urls.map((url) => {
              return (
                <Combobox.Option value={url}>
                  {({ active }) => {
                    return (
                      <div
                        className={`p-1.5 rounded ${active ? "bg-indigo-600" : "bg-white"}`}
                      >
                        {url}
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
