import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import SearchInput from "./SearchInput";
import { Trash } from "lucide-react";

function AddItem({
  db,
  setTotal,
  id,
  handleDelete,
  error,
  quantity,
  maintotal,
}: {
  db: any;
  setTotal: Function;
  id: number;
  handleDelete: any;
  error: any;
  quantity?: any;
  maintotal?: Number;
}) {
  const [query, setQuery] = useState("");
  let filteredData = db.filter((data: any) => {
    return data.id === query ? data : "";
  });

  const initialState = {
    itemid: "",
    itemname: "",
    price: filteredData[0]?.price || 0,
    tax: "0",
    qty: quantity?.qty || 1,
  };

  const [formValues, setFormvalues] = useState(initialState);
  const previous = useRef(0);
  let total: any;
  let totalinctax: any;
  let noqtyval = filteredData[0]?.qty;
  let noqty = noqtyval + (quantity?.qty || 0) - Number(formValues?.qty) < 0;

  if (!noqty) {
    total = Number(formValues?.qty) * Number(formValues?.price) || 0;
    totalinctax = total + (total * Number(filteredData[0]?.tax)) / 100 || 0;
  }

  if (noqty) {
    totalinctax = previous.current;
  }

  useEffect(() => {
    if (quantity) {
      setQuery(quantity?.itemid);
    }
  }, [quantity]);

  function handleQueryChange(e: any) {
    setQuery("");
    setQuery(e.target.value);
  }

  useEffect(() => {
    setTotal((p: any) => p - previous.current + totalinctax);
    console.log("Total", maintotal);
    totalinctax === 0
      ? (previous.current = 0)
      : (previous.current = totalinctax);
    setFormvalues({
      ...formValues,
      tax: filteredData[0]?.tax,
    });
  }, [formValues?.qty, query, total]);

  useEffect(() => {
    setFormvalues({
      ...formValues,
      price: filteredData[0]?.price,
    });
  }, [filteredData[0]?.price]);

  return (
    <TableRow className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 group">
      {/* Item ID Column */}
      <TableCell className="w-16 sm:w-24 p-2">
        <div className="flex flex-col">
          <Input
            name="itemid"
            type="text"
            value={query || filteredData[0]?.itemid || ""}
            className="w-full text-center font-medium border-slate-300 focus:border-slate-500 
              text-sm sm:text-base p-1 sm:p-2 rounded-md"
            onChange={(event) => handleQueryChange(event)}
          />
          {error?.itemid && (
            <span className="text-red-500 text-xs mt-1">{error?.itemid}</span>
          )}
        </div>
      </TableCell>

      {/* Item Name Column */}
      <TableCell className="w-32 sm:w-48 p-2">
        <SearchInput
          db={db}
          setQuery={setQuery}
          filteredData={filteredData}
          setFormValues={setFormvalues}
          formValues={formValues}
          total={totalinctax}
          setTotal={setTotal}
        />
      </TableCell>

      {/* Price Column */}
      <TableCell className="w-24 p-2">
        <Input
          name="price"
          type="text"
          className="w-full text-right text-sm sm:text-base 
            border-slate-300 focus:border-slate-500 p-1 sm:p-2 rounded-md"
          value={Number(filteredData[0]?.price) || ""}
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              price: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* Tax Column */}
      <TableCell className="w-20 p-2">
        <Input
          name="tax"
          type="number"
          min={0}
          className="w-full text-right text-sm sm:text-base 
            border-slate-300 focus:border-slate-500 p-1 sm:p-2 rounded-md"
          value={Number(filteredData[0]?.tax) || ""}
          onChange={(event) => {
            setFormvalues({
              ...formValues,
              tax: event.target.value,
            });
          }}
        />
      </TableCell>

      {/* Quantity Column */}
      <TableCell className="w-24 p-2">
        <div className="flex flex-col">
          <Input
            name="qty"
            type="number"
            min={0}
            max={noqtyval + (quantity?.qty || 0)}
            value={formValues?.qty}
            className="w-full text-right text-sm sm:text-base 
              border-slate-300 focus:border-slate-500 p-1 sm:p-2 rounded-md"
            onChange={(event) =>
              setFormvalues({
                ...formValues,
                qty: event.target.value,
              })
            }
          />
          {noqty && (
            <span className="text-red-500 text-xs mt-1">
              Quantity Unavailable
            </span>
          )}
        </div>
      </TableCell>

      {/* Total Column */}
      <TableCell className="w-32 p-2">
        <Input
          name="inditotal"
          type="text"
          value={totalinctax}
          className="w-full text-right text-sm sm:text-lg font-bold 
            border-slate-300 focus:border-slate-500 p-1 sm:p-2 rounded-md bg-slate-50"
          readOnly
        />
      </TableCell>

      {/* Delete Column */}
      <TableCell className="w-16 p-2">
        <Button
          type="button"
          onClick={() => handleDelete(id, totalinctax)}
          className="bg-red-500 hover:bg-red-600 text-white 
            transition duration-150 rounded-full p-2 sm:p-3 
            flex items-center justify-center group-hover:scale-105"
        >
          <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default AddItem;
