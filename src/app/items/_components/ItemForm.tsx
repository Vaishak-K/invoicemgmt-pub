"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

import { addItem, updateItem } from "@/app/actions/item";

export default function ItemForm({ item }: { item?: any }) {
  const [error, action] = useFormState(
    item == null ? addItem : updateItem.bind(null, item.id),
    {}
  );

  return (
    <form
      action={action}
      className="border-2 border-gray-300 rounded-lg p-6 shadow-md bg-white"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {item ? "Edit Item" : "Add New Item"}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="itemname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Item Name
        </label>
        <Input
          id="itemname"
          name="itemname"
          placeholder="Enter Item Name"
          defaultValue={item?.itemname || ""}
          className="border rounded-md p-2 w-full"
        />
        {error?.itemname && (
          <div className="text-red-500 text-sm mt-1">{error.itemname}</div>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Price
        </label>
        <Input
          id="price"
          name="price"
          placeholder="Enter the Item Price"
          defaultValue={item?.price || ""}
          className="border rounded-md p-2 w-full"
        />
        {error?.price && (
          <div className="text-red-500 text-sm mt-1">{error.price}</div>
        )}
      </div>

      <div className="sm:flex sm:justify-between mb-4">
        <div className="sm:w-1/2 mr-2">
          <label
            htmlFor="qty"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity
          </label>
          <Input
            id="qty"
            name="qty"
            placeholder="Enter Product Quantity"
            type="number"
            defaultValue={Number(item?.qty) || ""}
            className="border rounded-md p-2 w-full"
          />
          {error?.qty && (
            <div className="text-red-500 text-sm mt-1">{error.qty}</div>
          )}
        </div>

        <div className="sm:w-1/2 ml-2">
          <label
            htmlFor="tax"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tax (%)
          </label>
          <Input
            id="tax"
            name="tax"
            placeholder="Enter the Tax (%)"
            defaultValue={item?.tax || ""}
            className="border rounded-md p-2 w-full"
          />
          {error?.tax && (
            <div className="text-red-500 text-sm mt-1">{error.tax}</div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="mt-5 w-full bg-teal-500 hover:bg-teal-600 text-white"
      >
        Submit
      </Button>
    </form>
  );
}
