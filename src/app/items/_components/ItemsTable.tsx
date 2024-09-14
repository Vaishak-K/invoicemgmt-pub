"use client";

import Modal from "@/app/invoice/_components/Modal";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AddCustomerValue, UpdateCustomerValue } from "@/app/actions/customer";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import {
  ExtractCustomerData,
  ExtractItemsData,
} from "@/components/ExtractCustomerData";
import { JustAddItemValue, UpdateItemValue } from "@/app/actions/item";
function ItemsTable({ users }: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [nums, setNums] = useState<Number>(1);
  let k: any;
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  // file
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [errval, setErrVal] = useState<any>([]);
  console.log(file);
  // json stringified (purpose of previewing)
  const previewData = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const saveData = () => {
    console.log("Save Function is Executing");
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);

          //Save to the DB
          nums === 1 ? (k = UpdateItemValue) : (k = JustAddItemValue);
          json.map((item: any, i) => {
            const val: any = k(item);
            if (val) {
              setErrVal((prevErrVal: any) => [...prevErrVal, { i: val }]);
            } else {
              setErrVal((prevErrVal: any) => [...prevErrVal, { i: "no" }]);
            }
          });
          // console.log(json);

          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div className="py-8 space-y-8">
        {/* BUTTONS */}
        {/* upload input, preview btn , save btn , clear Data */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
           
          >
            Open Modal
          </button> */}
          <div className="sm:flex sm:justify-start w-full">
            <label
              className=" mb-2 text-sm w-2/12 font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file
            </label>

            <Input
              className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 self-center"
              id="file_input"
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {/* <div
              id="drop_zone"
              onDrop={(e) => {
                console.log(e);
              }}
            >
              <p>
                Drag one or more files to this <i>drop zone</i>.
              </p>
            </div> */}
          </div>

          <Button
            onClick={previewData}
            className="py-2 px-6 rounded bg-blue-500/90 text-slate-100 "
          >
            Preview Data
          </Button>
          <Modal show={isModalOpen} onClose={closeModal} onConfirm={saveData} />
          <Button
            onClick={() => {
              setNums(2);
              openModal();
            }}
            className="py-2 px-6 rounded bg-green-500/90 text-slate-100 "
          >
            Save Data
          </Button>

          <Modal
            show={isModalOpen}
            onClose={closeModal}
            onConfirm={saveData}
            nums={nums}
          />
          <Button
            onClick={() => {
              setNums(1);
              openModal();
            }}
            className="py-2 px-6 rounded bg-green-500/90 text-slate-100 "
          >
            Add and Update Data
          </Button>
          {/* <button
            onClick={previewData}
            className="py-2 px-6 rounded bg-red-600 text-slate-100 "
          >
            Clear Data
          </button> */}
        </div>
        <pre>{jsonData}</pre>
        {errval?.map((err: any, i: number) => {
          if (err) {
            <div className="text-destructive font-normal">
              <h1>Error at {i + 1} Check the Values</h1>
              <h1>{err?.name}</h1>
              <h1>{err?.address}</h1>
              <h1>{err?.phone}</h1>
              <h1>{err?.gst}</h1>
              <h1>{err?.email}</h1>
            </div>;
          }
        })}
      </div>
    </>
  );
}

export default ItemsTable;
{
  /* 
        {loading ? (
          <p>Saving Data please wait...</p>
        ) : (
          <div className="relative overflow-x-auto">
            {users && users.length > 0 && (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3">
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.name}
                      </th>
                      <td className="px-6 py-4">{user.age}</td>
                      <td className="px-6 py-4">{user.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          </div>
        )} */
}
{
  /* const exportToXLSX = async (): Promise<void> => {
    // Convert data to worksheet
    const customerDetails: Array<Record<string, any>> =
      await ExtractItemsData();

    // Ensure that data exists before proceeding
    if (!customerDetails || customerDetails.length === 0) {
      console.error("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(customerDetails);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to a file
    XLSX.writeFile(workbook, `workbook1.xlsx`);
  }; */
}

{
  /* Table */
}
