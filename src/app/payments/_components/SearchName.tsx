"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React, { useMemo, useState, useEffect, useRef } from "react";

function SearchName({
  db,
  filteredData,
  setCustName,
}: {
  db: any;
  filteredData: any;
  setCustName: any;
}) {
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const [filteredItem, setFilteredItem] = useState<any>(null); // Selected item state
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Memoized filtered results based on user input
  const filtered = useMemo(
    () =>
      db
        ? db?.filter((data: any) =>
            data?.name.toLowerCase().includes(searchInput.toLowerCase())
          )
        : undefined,
    [searchInput, db]
  );
  // useEffect(() => {
  //   filteredData?.id ? setSearchInput(filteredData?.name) : "";
  // }, []);

  function handleFilteredItem(item: any) {
    setCustName({ id: item?.id, name: item?.name, credit: item?.Credit }); // Update parent component state
    setFilteredItem(item); // Update filteredItem state
    setSearchInput(item?.name); // Set the input field value to selected item
    setIsOpen(false); // Close dropdown after selection
  }
  function clearSearchBar() {
    setSearchInput("");
    setCustName({ id: "", name: "" });
  }
  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (filteredData) {
      setSearchInput(filteredData?.name);
    }
  }, []);
  return (
    <div className="relative">
      <div className="flex">
        <Input
          className="max-w-20 sm:max-w-48 font-medium border-slate-300 focus:border-slate-500"
          type="text"
          name="customerid"
          autoComplete="off"
          value={filteredData?.id || searchInput} // The input value should always reflect `searchInput`
          placeholder="Select a Value"
          onChange={(e) => {
            setSearchInput(e.target.value); // Allow user to type freely
            setIsOpen(true); // Open dropdown on input change
          }}
          onFocus={() => setIsOpen(true)} // Open dropdown when input is focused
        />
        <Button
          onClick={clearSearchBar}
          type="button"
          className={`${
            searchInput ? "block" : "hidden"
          } bg-red-500 p-2 font-extrabold text-xl`}
        >
          X
        </Button>
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute overflow-y-auto max-h-20 bg-white w-44 z-50 border border-gray-200"
        >
          {/* "Others" option */}
          {/* <button
            type="button"
            className="flex w-full justify-between px-2 py-1 hover:bg-gray-200"
            onClick={() => handleFilteredItem({ id: "", name: "Others" })}
          >
            <h1>Others</h1>
          </button> */}

          {/* List of filtered items */}
          {filtered?.length > 0 ? (
            filtered.map((item: any) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full justify-between px-2 py-1 hover:bg-gray-200"
                onClick={() => handleFilteredItem(item)} // Select item
              >
                {/* <h1>{item.id}</h1> */}
                <h1>{item?.name}</h1>
              </button>
            ))
          ) : (
            // Show "No results found" message if no items match the search
            <div className="px-2 py-1 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchName;
