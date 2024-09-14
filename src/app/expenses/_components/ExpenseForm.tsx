"use client";

import { addExpense, updateExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useFormState } from "react-dom";

function ExpenseForm({ expenses }: { expenses?: any | null }) {
  const date = expenses?.createdAt
    ? new Date(expenses?.createdAt).toDateString()
    : new Date().toDateString();
  const [isTaxable, setIsTaxable] = useState<any>(expenses?.isTaxable || false);
  const [empname, setEmpName] = useState<string>(expenses?.empname || "");
  const employees = ["Sugunan", "Ramesh", "Raghavan"];
  const expenseReasons = ["Transport", "Vehicle Repair", "Food"];
  const [reason, setReason] = useState<string>(expenses?.reason || "");
  const [error, action] = useFormState(
    expenses == null
      ? addExpense
      : updateExpense.bind(null, expenses?.id || ""),
    {}
  );

  return (
    <div className="border-2 border-gray-300 p-6 rounded-lg shadow-lg bg-white w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-teal-600 text-center">
        {expenses ? "Edit Expense Form" : "Expense Form"}
      </h1>
      <h2 className="pb-3 text-center">
        Date:{" "}
        <span className="bg-slate-400/30 rounded-md p-2 text-base font-medium">
          {date}
        </span>
      </h2>
      <form action={action}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label htmlFor="empname" className="block text-gray-700">
            Employee Name:
          </label>
          <div className="flex flex-col gap-y-3">
            <select
              name="empname"
              id="empname"
              defaultValue={
                employees.includes(expenses?.empname) ? expenses?.empname : ""
              }
              onChange={(e) => setEmpName(e.target.value)}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            >
              <option value="">Select Employee Name</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
              <option value="Others">Others</option>
            </select>
            {empname === "Others" ||
            (expenses?.empname && !employees.includes(expenses?.empname)) ? (
              <Input
                id="empname"
                name="empname"
                type="text"
                autoComplete="off"
                defaultValue={expenses?.empname || ""}
                placeholder="If others, Specify your Name"
                className="border border-teal-300 focus:ring focus:ring-teal-200"
              />
            ) : null}
            {error?.empname && (
              <div className="text-red-500 mt-1">{error?.empname}</div>
            )}
          </div>

          <label htmlFor="reason" className="block text-gray-700">
            Reason:
          </label>
          <div className="flex flex-col gap-y-3">
            <select
              name="reason"
              id="reason"
              defaultValue={
                expenseReasons.includes(expenses?.reason)
                  ? expenses?.reason
                  : ""
              }
              onChange={(e) => setReason(e.target.value)}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            >
              <option value="">Select a Reason</option>
              {expenseReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
              <option value="Others">Others</option>
            </select>
            {reason === "Others" ||
            (expenses?.reason && !expenseReasons.includes(expenses?.reason)) ? (
              <Input
                id="reason"
                name="reason"
                autoComplete="off"
                placeholder="If others, Specify the Reason"
                defaultValue={expenses?.reason || ""}
                className="border border-teal-300 focus:ring focus:ring-teal-200"
              />
            ) : null}
            {error?.reason && (
              <div className="text-red-500 mt-1">{error?.reason}</div>
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
              defaultValue={expenses?.amount || ""}
              className="border border-teal-300 focus:ring focus:ring-teal-200"
            />
            {error?.amount && (
              <div className="text-red-500 mt-1">{error?.amount}</div>
            )}
          </div>

          <label htmlFor="isTaxable" className="block text-gray-700">
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
                  defaultValue={expenses?.taxValue || ""}
                  className="border border-teal-300 focus:ring focus:ring-teal-200"
                />
                {error?.taxValue && (
                  <div className="text-red-500 mt-1">{error?.taxValue}</div>
                )}
              </div>
            </>
          )}
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

export default ExpenseForm;
