"use client";

import { addPayment, updatePayment } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { GetInvoice, GetNames } from "./FetchData";
import SearchName from "./SearchName";
import Invoices from "@/app/invoice/page";

function PaymentsForm({ payments }: { payments?: any | null }) {
  const date = payments?.createdAt
    ? new Date(payments?.createdAt).toDateString()
    : new Date().toDateString();

  const [custname, setCustName] = useState<any>(
    payments?.customerid
      ? { id: payments.customerid, name: payments?.Customer.name }
      : ""
  );
  const [invoices, setInvoices] = useState<any>(payments?.invoices || "");

  const [customerNames, setCustomerNames] = useState<any>([]);

  const [reason, setReason] = useState<string>(payments?.invoiceid || "null");
  const modesofpay = ["By Cash", "Cheque", "UPI", "Net Banking"];

  const [modeofpayments, setModeOfPayments] = useState<string>(
    payments?.modeofpayment || ""
  );

  function PrintFormData(formData: FormData) {
    const obj = Object.fromEntries(formData.entries());
    console.log("Object", obj);
  }
  const [error, action] = useFormState(
    payments == null
      ? addPayment
      : updatePayment.bind(null, payments?.id || ""),
    {}
  );
  useEffect(() => {
    const fetchData = async () => {
      const a = await GetNames();

      // Update the state
      setCustomerNames(a);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (custname) {
        const a = await GetInvoice(custname?.id);
        setInvoices(a?.invoice);
      } else {
      }
      // Update the state
    };

    fetchData();
  }, [custname]);

  return (
    <div className="border-2 border-gray-300 p-6 rounded-lg shadow-lg bg-white w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-teal-600 text-center">
        {payments ? "Edit Payments Form" : "Payments Form"}
      </h1>
      <h2 className="pb-3 text-center">
        Date:{" "}
        <span className="bg-slate-400/30 rounded-md p-2 text-base font-medium">
          {date}
        </span>
      </h2>
      <form action={action}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-4">
            <label htmlFor="empname" className="block text-gray-700">
              Customer Name:
            </label>
            {custname && custname?.name !== "Others" ? (
              <h1
                className={`font-semibold text-center rounded-lg ${
                  custname?.credit < 0
                    ? "text-green-800  bg-green-300"
                    : custname?.credit > 0
                    ? "text-red-800  bg-red-300"
                    : "text-slate-800  bg-slate-300"
                } text-lg max-w-full`}
              >
                Credit:{custname?.credit}
              </h1>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-y-3">
            <SearchName
              db={customerNames}
              filteredData={custname}
              setCustName={setCustName}
            />
            {custname?.id && custname?.name && <h1>{custname?.name}</h1>}
            {custname?.name === "Others" ||
            (payments?.customername &&
              !customerNames.includes(payments?.empname)) ? (
              <Input
                id="customername"
                name="customername"
                type="text"
                autoComplete="off"
                defaultValue={payments?.customername || ""}
                placeholder="If others, Specify your Name"
                className="border border-teal-300 focus:ring focus:ring-teal-200"
              />
            ) : null}
            {error?.customerid && (
              <div className="text-red-500 mt-1">{error?.customerid}</div>
            )}
            {error?.customername && (
              <div className="text-red-500 mt-1">
                {error?.customername} (Customer Name)
              </div>
            )}
          </div>

          <label htmlFor="paymentreason" className="block text-gray-700">
            Invoices:
          </label>
          <div className="flex flex-col gap-y-3">
            <select
              name="invoiceid"
              id="invoiceid"
              value={reason || ""}
              onChange={(e) => setReason(e.target.value)}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            >
              <option value="">Select a Reason</option>

              {invoices &&
                invoices.map((reason: any) =>
                  payments ? (
                    <option key={reason?.id} value={reason?.id}>
                      Invoice : {reason?.id} Pending:{reason?.credit}
                    </option>
                  ) : (
                    reason?.credit !== 0 && (
                      <option key={reason?.id} value={reason?.id}>
                        Invoice : {reason?.id} Pending:{reason?.credit}
                      </option>
                    )
                  )
                )}
              <option value="null">Others</option>
            </select>
            {reason === "null" || payments?.reason ? (
              <Input
                id="paymentreason"
                name="paymentreason"
                autoComplete="off"
                placeholder="If others, Specify the Reason"
                defaultValue={
                  payments?.invoiceid ? "" : payments?.paymentreason || ""
                }
                className="border border-teal-300 focus:ring focus:ring-teal-200"
              />
            ) : null}
            {error?.invoiceid && (
              <div className="text-red-500 mt-1">
                {error?.invoiceid} (Invoice ID)
              </div>
            )}
            {error?.paymentreason && (
              <div className="text-red-500 mt-1">
                {error?.paymentreason} (Payment Reason)
              </div>
            )}
          </div>

          <label htmlFor="amount" className="block text-gray-700">
            Amount:
          </label>
          <div className="flex flex-col gap-y-3">
            <Input
              id="amount"
              name="amount"
              type="text"
              defaultValue={payments?.amount || ""}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            />
            {error?.amount && (
              <div className="text-red-500 mt-1">{error?.amount}</div>
            )}
          </div>
          <label htmlFor="reason" className="block text-gray-700">
            Mode of Payment:
          </label>
          <div className="flex flex-col gap-y-3">
            <select
              name="modeofpayment"
              id="modeofpayment"
              defaultValue={payments?.modeofpayment || ""}
              onChange={(e) => setModeOfPayments(e.target.value)}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            >
              <option value="">Select a Mode of Payment</option>

              {modesofpay.map((mode: any) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
              <option value="Others">Others</option>
            </select>
            {modeofpayments === "Others" ||
            (payments?.modeofpayment &&
              !modesofpay.includes(payments?.modeofpayment)) ? (
              <Input
                id="reason"
                name="reason"
                autoComplete="off"
                placeholder="If others, Specify the Reason"
                defaultValue={payments?.reason || ""}
                className="border border-teal-300 focus:ring focus:ring-teal-200"
              />
            ) : null}
            {error?.modeofpayment && (
              <div className="text-red-500 mt-1">{error?.modeofpayment}</div>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-teal-500 text-white hover:bg-teal-600 transition duration-200 mt-4"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default PaymentsForm;

{
  /* <label htmlFor="isTaxable" className="block text-gray-700">
Is this Taxable?:
</label>
<div className="flex items-center">
<Input
  id="isTaxable"
  name="isTaxable"
  type="checkbox"
  checked={isTaxable}
  onChange={() => setIsTaxable(!isTaxable)}
  className="self-center"
/>
</div>

{isTaxable && (
<>
  <label htmlFor="taxValue" className="block text-gray-700">
    Tax Value:
  </label>
  <div className="flex flex-col gap-y-3">
    <Input
      id="taxValue"
      name="taxValue"
      type="text"
      defaultValue={payments?.taxValue || ""}
      className="border border-teal-300 focus:ring focus:ring-teal-200"
    />
    {error?.taxValue && (
      <div className="text-red-500 mt-1">{error?.taxValue}</div>
    )}
  </div>
</>
)} */
}

{
  /* <select
              name="customerid"
              id="customerid"
              defaultValue={
                employees.includes(payments?.customerid)
                  ? payments?.customerid
                  : ""
              }
              onChange={(e) => setCustName(e.target.value)}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            >
              <option value="">Select Employee Name</option>
              {customerNames.map((payment: any) => (
                <option key={payment.id} value={payment.name}>
                  {payment.name}
                </option>
              ))}
              <option value="Others">Others</option>
            </select> */
}
