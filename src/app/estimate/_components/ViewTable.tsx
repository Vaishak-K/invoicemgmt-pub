import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ToWords } from "to-words";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ViewTable({ db }: any) {
  let quantity;
  db?.quantity ? (quantity = JSON.parse(db?.quantity)) : "";
  const toWords = new ToWords();
  let amountInWords = toWords.convert(Math.floor(db?.total));

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <Image src="/4thepeoplelogo.jpeg" alt="logo" width={200} height={100} />
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-semibold text-lg">Billing Address</h1>
          <p>{db?.customer.name}</p>
          <p>{db?.customer.address}</p>
          <p>Credit: {db?.customer.Credit}</p>
        </div>
        <div>
          <h1 className="font-semibold text-lg">Sold by</h1>
          <p>SBC Home Needs</p>
          <p>1st Floor, ABC Building</p>
          <p>Palakkad</p>
          <p>Created At: {db?.createdAt.toDateString()}</p>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      <h1 className="font-semibold text-lg">Invoice ID: {db?.id}</h1>
      <h1 className="mb-4">Created At: {db?.createdAt.toDateString()}</h1>

      <Table className="mt-4 w-full text-center border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead>S.No</TableHead>
            <TableHead>Item ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quantity?.map((qt: any, i: number) => (
            <TableRow key={i} className="hover:bg-gray-100">
              <TableCell>{i + 1}</TableCell>
              <TableCell>{qt.itemid}</TableCell>
              <TableCell>{qt.itemname}</TableCell>
              <TableCell>{qt.price}</TableCell>
              <TableCell>{qt.qty}</TableCell>
              <TableCell>{qt.tax}%</TableCell>
              <TableCell>{qt.inditotal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-3 mt-5 justify-between text-right font-bold">
        <h1 className="col-span-2 text-left">
          <span className="font-semibold">Amount in Words:&nbsp;</span>
          {amountInWords} only
        </h1>
        <h1 className="text-sm">Grand Total: {db?.total} /-</h1>
      </div>

      <div className="flex justify-end mt-6"></div>
    </div>
  );
}

export default ViewTable;
