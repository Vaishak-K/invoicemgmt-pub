"use client";

import PageHeader from "@/components/PageHeader";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import dynamic from "next/dynamic";
import { AddInvoice, UpdateInvoice } from "@/app/actions/invoice";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  DollarSign,
  FileText,
  Users,
  Check,
  X,
} from "lucide-react";
import CustSearch from "./CustSearch";

const Tablebody = dynamic(() => import("../_components/Tablebody"), {
  ssr: false,
});

function Invoices({
  db,
  customerdb,
  invoice,
}: {
  db: any;
  customerdb: any;
  invoice?: any;
}) {
  let arr: any[] = [];
  let obj: any = {};

  const { current: deletedVals } = useRef<any>([]);
  const [total, setTotal] = useState(0);
  const [customerd, setCustomerd] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    invoice?.paymentOption || "fullcredit"
  );
  const [partialvalue, setPartialValue] = useState("");
  let first;
  let last;
  let quantity = invoice?.quantity;
  let quan: any = quantity ? JSON.parse(quantity) : [];
  let tota = 0;

  const [modeofpayments, setModeOfPayments] = useState<string>(
    invoice?.Payments[0]?.modeofpayment || "By Cash"
  );
  quan.forEach((q: any, i: number) => {
    if (i > 0) {
      tota += q?.inditotal || 0;
    }
  });

  useEffect(() => {
    if (invoice) {
      setCustomerd(invoice.customerid);
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice) {
      setTotal(tota);
    }
  }, [invoice, tota]);

  type Customer = {
    id: string;
    name: string;
    customerid: number | null;
    address: string;
    phone: bigint;
    GST: string | null;
    Credit: number;
    Email: string;
    createdAt: Date;
    updatedAt: Date;
    estimateid: string | null;
  };

  const filteredData = customerdb.filter(
    (data: Customer) => data.id === customerd
  );
  const modesofpay = ["By Cash", "Cheque", "UPI", "Net Banking", "Card"];
  total < Math.abs(filteredData?.Credit)
    ? modesofpay.push("Credit")
    : undefined;

  const [error, action] = useFormState(submitForm, []);
  let t = arr[0]?.itemid == null;
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
    let modeofval =
      selectedOption === "fullcredit" ? undefined : modeofpayments;
    const item: any = { total, selectedOption };

    if (modeofval !== undefined) {
      item.modeofpayments = modeofpayments;
    }
    arr.push(item);

    last = arr.pop();
    first = arr.shift();

    first["total"] = last["total"];
    first["payment"] = last["selectedOption"];
    first["modeofpayment"] = last["modeofpayments"];

    if (arr[0]?.itemid == null) {
      return { noitem: "There are no items in the Cart to Submit" };
    }

    errormessage = await (invoice == null
      ? AddInvoice(arr, first)
      : UpdateInvoice(invoice.id, arr, first));

    obj = {};
    arr = [];
    first = {};

    return errormessage;
  }
  const date = invoice?.createdAt
    ? new Date(invoice?.createdAt).toDateString()
    : new Date().toDateString();

  let errortoSend = !error?.noitem ? error.slice(1) || error : [];

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-teal-100 to-teal-200 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-5xl border-2 border-teal-200">
        <form action={action} className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b-2 border-teal-100 pb-4">
            <div className="flex items-center space-x-3">
              <FileText className="text-teal-600" size={32} />
              <h1
                className={`text-2xl font-bold text-teal-800 ${
                  invoice ? "" : "hidden"
                }`}
              >
                Invoice ID: {invoice?.id}
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
                <Users className="text-teal-600" size={24} />
                <label
                  htmlFor="customerid"
                  className="font-semibold text-teal-800"
                >
                  Customer Details
                </label>
              </div>
              {/* <Input
                name="customerid"
                id="customerid"
                placeholder="Enter Customer ID"
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
                <DollarSign className="text-green-600" size={24} />
                <label
                  className="font-semibold text-xl text-green-800"
                  htmlFor="credit"
                >
                  Available Credit
                </label>
              </div>
              <Input
                type="text"
                id="credit"
                value={filteredData[0]?.Credit}
                className="text-center text-xl w-32 font-semibold bg-green-50 border-green-300"
                readOnly
              />
            </div>
          </div>

          {/* Table Section */}
          <Table className="mb-6 border-2 border-teal-100">
            <TableCaption className="text-teal-700">Invoice Items</TableCaption>
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
          </Table>

          {/* Total and Payment Section */}
          <div className="flex flex-col space-y-6">
            <div className="flex justify-end items-center space-x-4">
              <h1 className="text-3xl font-bold text-teal-900">Group Total:</h1>
              <div className="bg-teal-100 px-4 py-2 rounded-lg text-2xl font-semibold text-teal-800">
                {total}
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg space-y-4">
              <h1 className="text-xl font-semibold text-teal-800 mb-4">
                Payment Received
              </h1>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="full"
                    id="payment"
                    checked={selectedOption === "full"}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="payment" className="text-gray-700">
                    Full Paid
                  </label>
                </div>

                {selectedOption === "full" && (
                  <div className="pl-6 space-y-3">
                    <select
                      id="modeofpayment"
                      value={modeofpayments || ""}
                      onChange={(e) => setModeOfPayments(e.target.value)}
                      className="w-full border-teal-300 rounded-md focus:ring-2 focus:ring-teal-400"
                    >
                      {modesofpay.map((mode: any) => (
                        <option key={mode} id={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                    {error[0]?.modeofpayment && (
                      <div className="text-red-500 flex items-center space-x-2">
                        <X className="text-red-500" size={20} />
                        {error[0]?.modeofpayment}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="payment"
                    value="fullcredit"
                    checked={selectedOption === "fullcredit"}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="payment" className="text-gray-700">
                    Full Credit
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <CreditCard size={24} />
            <span>Submit Invoice</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Invoices;
