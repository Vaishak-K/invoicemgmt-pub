"use client";

import { Input } from "@/components/ui/input";

import React, { useMemo, useState, useEffect, useRef } from "react";

function SearchInput({
  db,
  setQuery,
  filteredData,
  setFormValues,
  formValues,
  total,
  setTotal,
  previous,
}: {
  db: any[];
  setQuery: any;
  filteredData: any;
  setFormValues: any;
  formValues: any;
  total: any;
  previous: any;
  setTotal: any;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [filteredItem, setFilteredItem] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () =>
      db?.filter((data: any) =>
        data.itemname.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, db]
  );
  const initialState = {
    itemid: "",
    itemname: "",
    price: filteredData[0]?.price || 0,
    tax: "0",
    qty: 1,
  };
  console.log(filtered);
  function handleFilteredItem(item: any) {
    // setTotal((p: any) => {
    //   console.log("Previous", p);
    //   console.log("Previous Current", previous.current);
    //   console.log("Total", total);
    //   console.log("Value:", p - previous.current + total);
    //   return p - previous.current + total;
    // });
    filteredData = initialState;
    setQuery("");

    setFilteredItem(item);
    // filteredData = item;
    setTimeout(() => {
      setQuery(item?.id || "");
    });

    setSearchInput(item?.itemname); // Clear input
    setIsOpen(false);
    setSearchInput(""); // Close dropdown
  }

  // Close dropdown when clicking outside
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

  return (
    <div className="relative">
      <Input
        className="max-w-20 sm:max-w-48 font-medium border-slate-300 focus:border-slate-500"
        type="text"
        name="itemname"
        autoComplete="off"
        value={searchInput || filteredData[0]?.itemname}
        onChange={(e) => {
          setIsOpen(true);
          setSearchInput(e.target.value); // Open dropdown on input change
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && filtered?.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute overflow-y-auto max-h-20 bg-white w-44 z-50 border border-gray-200"
        >
          {filtered.map((item: any) => (
            <button
              key={item.id} // Use a unique identifier for the key
              type="button"
              className="flex w-full justify-between px-2 py-1 hover:bg-gray-200"
              onClick={() => handleFilteredItem(item)}
            >
              <h1>{item.itemname}</h1>
              <h1>{item.qty}</h1>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
