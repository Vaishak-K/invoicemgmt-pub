"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addCustomer, updateCustomer } from "@/app/actions/customer";
import { useFormState } from "react-dom";

export default function CustomerForm({ customer }: { customer?: any }) {
  const [error, action] = useFormState(
    customer == null ? addCustomer : updateCustomer.bind(null, customer.id),
    {}
  );

  return (
    <form
      action={action}
      className="border-2 border-gray-300 p-6 rounded-lg shadow-lg bg-white w-full" // Ensure full width
    >
      <h2 className="text-2xl font-bold mb-4 text-teal-600">
        {customer ? "Edit Customer" : "Add Customer"}
      </h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Enter Customer Name"
          defaultValue={customer?.name || ""}
          className="sm:w-full border border-teal-300 focus:ring focus:ring-teal-200"
        />
        {error?.name && <div className="text-red-500 mt-1">{error?.name}</div>}
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700">
          Address
        </label>
        <Textarea
          id="address"
          name="address"
          placeholder="Enter the Address"
          defaultValue={customer?.address || ""}
          className="w-full border border-teal-300 focus:ring focus:ring-teal-200"
        />
        {error?.address && (
          <div className="text-red-500 mt-1">{error?.address}</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-4 mb-4">
        <div className="flex-1 mb-4 sm:mb-0">
          <label htmlFor="phone" className="block text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="Enter your Phone Number"
            type="tel"
            defaultValue={customer?.phone ? Number(customer.phone) : ""}
            className="w-full border border-teal-300 focus:ring focus:ring-teal-200"
          />
          {error?.phone && (
            <div className="text-red-500 mt-1">{error?.phone}</div>
          )}
        </div>

        <div className="flex-1 mb-4 sm:mb-0">
          <label htmlFor="gst" className="block text-gray-700">
            GST
          </label>
          <Input
            id="gst"
            name="gst"
            placeholder="Enter GST Number"
            defaultValue={customer?.GST || ""}
            className="w-full border border-teal-300 focus:ring focus:ring-teal-200"
          />
          {error?.gst && <div className="text-red-500 mt-1">{error?.gst}</div>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">
          Email
        </label>
        <Input
          id="email"
          name="email"
          placeholder="Enter your Email"
          type="email"
          defaultValue={customer?.Email || ""}
          className="w-full border border-teal-300 focus:ring focus:ring-teal-200"
        />
        {error?.email && (
          <div className="text-red-500 mt-1">{error?.email}</div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-teal-500 text-white hover:bg-teal-600 transition duration-200 mt-4"
      >
        Submit
      </Button>
    </form>
  );
}
