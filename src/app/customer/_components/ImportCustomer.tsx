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

import {
  AddCustomerValue,
  JustAddCustomerValue,
  UpdateCustomerValue,
} from "@/app/actions/customer";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import { ExtractCustomerData } from "@/components/ExtractCustomerData";
export default function UsersTable({ users }: any) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  // file
  const [nums, setNums] = useState<Number>(1);
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
    let k: any;
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
          nums === 1 ? (k = UpdateCustomerValue) : (k = JustAddCustomerValue);

          json.map((customer: any, i) => {
            const val: any = k(customer);
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
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Data Import Manager
        </h2>
        <p className="text-gray-500">
          Upload Excel files, preview, and manage your data seamlessly
        </p>
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* File Input */}
        <div className="col-span-2 space-y-2">
          <label
            htmlFor="file_input"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Excel File
          </label>
          <div className="relative">
            <Input
              className="w-full text-sm text-gray-900 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer 
              bg-gray-50 focus:outline-none focus:border-indigo-500 transition duration-300 
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
              file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 
              hover:file:bg-indigo-100"
              id="file_input"
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: .xls, .xlsx (Max 5MB)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            onClick={previewData}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 
            flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Preview Data</span>
          </Button>
        </div>
      </div>

      {/* Save and Update Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => {
            setNums(2);
            openModal();
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white transition duration-300 
          flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
          </svg>
          <span>Save Data</span>
        </Button>
        <Button
          onClick={() => {
            setNums(1);
            openModal();
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition duration-300 
          flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          <span>Add and Update Data</span>
        </Button>
      </div>

      {/* JSON Preview (Optional) */}
      {jsonData && (
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <h3 className="text-gray-700 font-medium mb-2">Data Preview</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {jsonData}
          </pre>
        </div>
      )}

      <Modal show={isModalOpen} onClose={closeModal} onConfirm={saveData} />
    </div>
  );
}
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
  /* Table */
}

// const exportToXLSX = async () => {
//   // Convert data to worksheet
//   const customer_details: any = await ExtractCustomerData();

//   const worksheet = XLSX.utils.json_to_sheet(customer_details);

//   // Create a new workbook
//   const workbook = XLSX.utils.book_new();

//   // Append the worksheet to the workbook
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   // Export the workbook to a file
//   XLSX.writeFile(workbook, `workbook1.xlsx`);
// };
