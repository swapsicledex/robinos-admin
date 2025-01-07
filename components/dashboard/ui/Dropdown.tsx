"use client";
import React, { useEffect, useState, useCallback } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { OptionsOrGroups, GroupBase, MultiValue } from "react-select";

// Define the item structure
export type DropdownItem = {
  value: string | number;
  label: string;
  extraProp?: string | number;
};

// Define props for the dropdown
export type DropdownProps = {
  apiEndpoint: string; // Endpoint for fetching data
  allowMultiple?: boolean; // Toggle for multi-select
  placeholder?: string; // Placeholder text
  value: DropdownItem | null;
  onChange: (option: DropdownItem | MultiValue<DropdownItem> | null) => void; // Callback when selection changes
  valueKey?: string;
  labelKey?: string;
  extraPropKey?: string;
  required?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  apiEndpoint,
  allowMultiple = false,
  placeholder = "Search and select...",
  value,
  onChange,
  valueKey = "id",
  labelKey = "name",
  extraPropKey,
  required = true,
}) => {
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  // Initialize client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch options from API with pagination
  const loadOptions = useCallback(
    async (
      inputValue: string, // Search query
      loadedOptions: OptionsOrGroups<DropdownItem, GroupBase<DropdownItem>>, // Already loaded options (used for infinite scroll)
      additional?: { page: number } // Pagination metadata
    ): Promise<{
      options: DropdownItem[];
      hasMore: boolean;
      additional: { page: number };
    }> => {
      try {
        const response = await fetch(
          `${apiEndpoint}&search=${inputValue}&limit=20&page=${
            additional?.page || 1
          }`
        );
        const data = await response.json();
        // console.log("data: ", data);

        // Transform data from API into the format needed by the dropdown
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const options = data?.data?.map((item: any) => ({
          value: item[`${valueKey}`],
          label: item[`${labelKey}`],
          extraProp: extraPropKey ? item[`${extraPropKey}`] : null,
        }));

        return {
          options,
          hasMore: data.length === 20, // Determine if more data is available
          additional: {
            page: additional?.page ? additional.page + 1 : 2, // Increment the page number
          },
        };
      } catch (error) {
        console.error("Error fetching options:", error);
        return {
          options: [],
          hasMore: false,
          additional: { page: 1 },
        };
      }
    },
    [apiEndpoint, valueKey, labelKey, extraPropKey] // Recreate the function when apiEndpoint changes
  );

  if (!isClient) {
    return null; // Avoid rendering the dropdown on the server side
  }

  return (
    <AsyncPaginate
      isMulti={allowMultiple} // Single or multi-select
      placeholder={placeholder} // Placeholder text
      value={value} // Controlled value
      loadOptions={loadOptions} // Load options from API
      debounceTimeout={300} // Debounce API calls
      additional={{
        page, // Start with current page
      }}
      onChange={(selected) => {
        if (allowMultiple) {
          onChange(selected ? selected : []);
        } else {
          onChange(selected ? selected : null);
        }
      }}
      onInputChange={() => {
        setPage(1); // Reset page number to 1 when search query changes
      }} // Update search query
      required={required}
      isClearable
      cacheUniqs={[apiEndpoint]} // Use `cacheUniqs` to uniquely identify the request cache
    />
  );
};

export default Dropdown;
