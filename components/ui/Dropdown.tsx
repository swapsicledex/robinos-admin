import React from "react";
import * as Select from "@radix-ui/react-select";

interface DropdownProps {
  items: { id: number | string; name: string; url?: string }[];
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  label,
  placeholder,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      <Select.Root onValueChange={onChange}>
        <Select.Trigger
          className="border border-gray-300 rounded-lg p-2 w-full flex justify-between items-center"
          aria-label={label}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Content className="z-50 bg-white border border-gray-300 rounded-lg shadow-lg">
          <Select.ScrollUpButton className="flex items-center justify-center p-2">
            ▲
          </Select.ScrollUpButton>
          <Select.Viewport>
            {items.map((item) => (
              <Select.Item
                key={item.id}
                value={item.id.toString()}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                {item.url && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <Select.ItemText>{item.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center p-2">
            ▼
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default Dropdown;
