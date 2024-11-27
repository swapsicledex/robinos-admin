import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type DropdownItem = {
  id: string | number;
  name: string;
  customComponent?: React.ReactNode; // For custom rendering
};

export type DropdownProps = {
  items: DropdownItem[];
  placeholder?: string;
  allowMultiple?: boolean;
  onChange: (selectedItems: DropdownItem[] | DropdownItem | null) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  allowMultiple = false,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState<DropdownItem[]>([]);

  const handleSelect = (item: DropdownItem) => {
    if (allowMultiple) {
      const alreadySelected = selectedItems.some(
        (selected) => selected.id === item.id
      );
      const newSelection = alreadySelected
        ? selectedItems.filter((selected) => selected.id !== item.id)
        : [...selectedItems, item];

      setSelectedItems(newSelection);
      onChange(newSelection);
    } else {
      setSelectedItems([item]);
      onChange(item);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center px-4 py-2 my-2 bg-white border rounded-md shadow-sm focus:outline-none hover:bg-gray-50">
          <span>
            {allowMultiple
              ? selectedItems.map((item) => item.name).join(", ") || "Select..."
              : selectedItems[0]?.name || "Select..."}
          </span>
          <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-64 p-2 bg-white border rounded-md shadow-lg"
          sideOffset={4}
        >
          {/* Search Bar */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          {/* List Items */}
          {filteredItems.length ? (
            filteredItems.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none"
                onSelect={() => handleSelect(item)}
              >
                {allowMultiple && (
                  <input
                    type="checkbox"
                    checked={selectedItems.some(
                      (selected) => selected.id === item.id
                    )}
                    readOnly
                    className="w-4 h-4 mr-2 rounded border-gray-300"
                  />
                )}
                {item.customComponent || (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </DropdownMenu.Item>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No items found</div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
