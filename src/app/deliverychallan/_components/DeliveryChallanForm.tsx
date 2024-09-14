"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import Invoices from "@/app/invoice/page";
import { GetInvoice, GetNames } from "@/app/payments/_components/FetchData";
import SearchName from "@/app/deliverychallan/_components/SearchName";
import {
  AddDeliveryChallan,
  UpdateDeliveryChallan,
} from "@/app/actions/deliverychallan";

function DeliveryChallanForm({ challan }: { challan?: any | null }) {
  // console.log("Challan", challan);
  let val: any = [];
  challan &&
    challan?.invoiceData?.map((id: any) => {
      val.push(String(id?.id));
    });
  const date = challan?.challanData?.createdAt
    ? new Date(challan?.challanData?.createdAt).toDateString()
    : new Date().toDateString();
  console.log("Date", date);
  // new Date(challan?.createdAt).toDateString() || new Date().toDateString();
  const [selectedTasks, setSelectedTasks] = useState<string[]>(val || []);
  let obj: any = {};

  async function handleSubmit(prevState: unknown, formdata: FormData) {
    let errormessage;
    let arr: [any][any] = []; // Initialize arr as an empty array
    const a = Object.fromEntries(formdata);
    // Iterate over form data entries

    obj["customerid"] = a["customerid"];
    // Add selectedTasks to the array
    obj["invoiceid"] = selectedTasks; // Wrap selectedTasks in a key-value pair
    errormessage = await (challan == null
      ? AddDeliveryChallan(obj)
      : UpdateDeliveryChallan(challan.id, obj));

    obj = {};

    return errormessage;
    // errormessage = await (challan == null
    //   ? AddDeliveryChallan(obj)
    //   : UpdateDeliveryChallan(challan.id, obj));
    // obj = {};

    // return errormessage;
  }

  const [customerNames, setCustomerNames] = useState<any>([]);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Toggle the selection of the checkbox
    setSelectedTasks((prevSelectedTasks) => {
      if (prevSelectedTasks.includes(value)) {
        // Remove from the selected tasks if it's already selected
        return prevSelectedTasks.filter((task) => task !== value);
      } else {
        // Add to the selected tasks if it's not selected
        return [...prevSelectedTasks, value];
      }
    });
  };

  console.log("Selecteed Tasks=>", selectedTasks);
  const [custname, setCustName] = useState<any>(
    challan
      ? { id: challan?.customerData?.id, name: challan?.customerData?.name }
      : ""
  );
  const [invoices, setInvoices] = useState<any>("");

  const [reason, setReason] = useState<string>(challan?.invoiceid || "null");

  function PrintFormData(formData: FormData) {
    const obj = Object.fromEntries(formData.entries());
    console.log("Object", obj);
  }
  const [error, action] = useFormState(handleSubmit, {});
  function handleCheck(id: string) {
    return selectedTasks.includes(id) ? true : false;
  }
  useEffect(() => {
    setSelectedTasks([]);
  }, [custname]);
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

  console.log("Customer details delivey challan", customerNames);
  console.log(
    "Customerid",
    custname?.id,
    "Customername:",
    custname?.name,
    "Invocices=>",
    invoices
  );
  return (
    <div className="border-2 border-gray-300 p-6 rounded-lg shadow-lg bg-white w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-teal-600 text-center">
        {challan ? "Edit Delivery Challan Form" : "Delivery Challan Form"}
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
          </div>
          <div className="flex flex-col gap-y-3">
            <SearchName
              db={customerNames}
              filteredData={custname}
              setCustName={setCustName}
            />
            {custname?.id && custname?.name && <h1>{custname?.name}</h1>}
            {error?.customerid && (
              <div className="text-red-500 mt-1">{error?.customerid}</div>
            )}
          </div>

          <label htmlFor="paymentreason" className="block text-gray-700">
            Invoices:
          </label>
          <div className="flex flex-col gap-y-3">
            {invoices?.length ? (
              invoices.map((reason: any) => (
                <label key={reason.id}>
                  <input
                    type="checkbox"
                    value={reason.id}
                    defaultChecked={selectedTasks.includes(reason?.id)}
                    onChange={handleCheckboxChange}
                  />{" "}
                  Invoice {reason.id}
                </label>
              ))
            ) : (
              <h1>{custname?.name && "No Invoices for this User"}</h1>
            )}
            <div>Selected Invoices: {selectedTasks.join(", ")}</div>
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

export default DeliveryChallanForm;
