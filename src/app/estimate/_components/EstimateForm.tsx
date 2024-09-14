"use client";

import PageHeader from "@/components/PageHeader";
import React, { act, useEffect, useRef, useState } from "react";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import dynamic from "next/dynamic";
import { AddEstimate, UpdateEstimate } from "@/app/actions/estimate";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, FileText, X } from "lucide-react";
import CustSearch from "@/app/invoice/_components/CustSearch";

const Tablebody = dynamic(() => import("./Tablebody"), {
  ssr: false,
});

function Estimates({
  db,
  customerdb,
  estimate,
}: {
  db: any;
  customerdb: any;
  estimate?: any;
}) {
  let arr: any[] = [];
  let obj: any = {};

  const { current: deletedVals } = useRef<any>([]);
  const [total, setTotal] = useState(0);
  const [customerd, setCustomerd] = useState("");

  let first;
  let last;
  let quantity = estimate?.quantity;
  let quan: any = quantity ? JSON.parse(quantity) : [];
  let tota = 0;

  quan.forEach((q: any, i: number) => {
    if (i > 0) {
      tota += q?.inditotal || 0;
    }
  });

  useEffect(() => {
    if (estimate) {
      setCustomerd(estimate.customerid);
    }
  }, [estimate]);

  useEffect(() => {
    if (estimate) {
      setTotal(tota);
    }
  }, [estimate, tota]);

  const filteredData = customerdb.filter((data: any) => data.id === customerd);

  const [error, action] = useFormState(submitForm, []);

  async function submitForm(prevState: unknown, formData: FormData) {
    let errormessage;

    for (const a of formData.entries()) {
      if (a[0] in obj || a[0] === "itemid") {
        arr.push(obj);

        obj = {};
      }
      obj[a[0]] = a[1];
    }

    arr.push(obj);

    arr.push(total);

    last = arr.pop();
    first = arr.shift();
    first["total"] = total;

    if (arr[0]?.itemid == null) {
      return { noitem: "There are no items in the Cart to Submit" };
    }

    errormessage = await (estimate == null
      ? AddEstimate(arr, first)
      : UpdateEstimate(estimate.id, arr, first));

    obj = {};
    arr = [];
    first = {};

    return errormessage;
  }

  const date = estimate?.createdAt
    ? new Date(estimate?.createdAt).toDateString()
    : new Date().toDateString();
  let errortoSend = !error?.noitem ? error.slice(1) || error : [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-teal-200 to-teal-300 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl border-2 border-teal-200">
        <form action={action}>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b-2 border-teal-100 pb-4">
            <div className="flex items-center space-x-3">
              <FileText className="text-teal-600" size={32} />
              <h1
                className={`text-2xl font-bold text-teal-800 ${
                  estimate ? "" : "hidden"
                }`}
              >
                Estimate ID: {estimate?.id}
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Check className="text-green-500" size={24} />
              <h1 className="text-xl font-semibold">Date: {date}</h1>
            </div>
          </div>

          {/* Customer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-teal-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <label
                  htmlFor="customerid"
                  className="font-semibold text-teal-800"
                >
                  Customer:&emsp;
                </label>
              </div>
              {/* <Input
                name="customerid"
                id="customerid"
                placeholder="Enter Customer Details"
                value={customerd}
                onChange={(e) => setCustomerd(e.target.value)}
                className="w-full border-teal-300 focus:ring-2 focus:ring-teal-400"
              /> */}
              <CustSearch
                db={customerdb}
                filteredData={filteredData}
                setQuery={setCustomerd}
              />
              {error[0]?.customerid && (
                <div className="text-red-500 flex items-center space-x-2">
                  <X className="text-red-500" size={20} />
                  {error[0]?.customerid}
                </div>
              )}
              <div className="text-gray-700">
                <h2 className="font-semibold">Name: {filteredData[0]?.name}</h2>
                <h2>Address: {filteredData[0]?.address}</h2>
              </div>
            </div>

            {/* Credit Section */}
            <div className="flex flex-col justify-center items-end space-y-4">
              <div className="flex items-center space-x-3">
                <label
                  className="font-semibold text-xl text-teal-800"
                  htmlFor="credit"
                >
                  Credit:&emsp;
                </label>
              </div>
              <Input
                type="text"
                id="credit"
                value={filteredData[0]?.Credit}
                className="text-center text-xl w-32 font-semibold bg-teal-50 border-teal-300"
                readOnly
              />
            </div>
          </div>

          {/* Table Section */}
          <Table className="mb-6 border-2 border-teal-100">
            <TableCaption className="text-teal-700">
              Estimate Items
            </TableCaption>
            <TableHeader className="bg-teal-100">
              <TableRow className="text-center">
                <TableHead>Item ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-left">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <Tablebody
              db={db}
              setTotal={setTotal}
              quantity={quantity}
              maintotal={total}
              current={deletedVals}
              error={errortoSend}
            />
            {error?.noitem && (
              <div className="text-red-500">{error?.noitem}</div>
            )}
          </Table>

          {/* Total Section */}
          <div className="flex flex-col gap-y-3 text-center items-center mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-teal-900 text-right w-full">
              Group Total: {total}
            </h1>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Estimates;
