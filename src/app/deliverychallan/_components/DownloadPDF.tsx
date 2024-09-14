"use client";

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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { uniqueId } from "lodash";
import { randomUUID } from "crypto";

// Import the autotable plugin

declare module "jspdf" {
  interface jsPDF {
    autoTable: any; // Or define a more specific type if you want
    lastAutoTable: {
      finalY: number;
    };
  }
}

function ViewTable({ db }: any) {
  let quantity: any;
  db?.quantity ? (quantity = JSON.parse(db?.quantity)) : "";
  console.log("Quantity", db?.quantity);
  const toWords = new ToWords();
  let amountInWords = toWords.convert(Math.floor(Number(db?.total)));

  const handleDownloadPDF = (ac: any) => {
    const pdf = new jsPDF();

    // Add Logo
    pdf.setFont("", "italic");
    pdf.addImage("/4thepeoplelogo.jpeg", "JPEG", 10, 10, 40, 10);
    pdf.setFontSize(14);

    pdf.text(`Delivery Challan`, 120, 15);
    pdf.setFont("", "bolditalic");

    pdf.text(
      `
    (Original for Recipient)`,
      120,
      20
    );
    pdf.setFont("", "bold");
    // Add Billing Address
    // pdf.setFontSize(14);

    pdf.text("Billing Address", 10, 50);
    pdf.setFont("", "normal");
    pdf.setFontSize(12);
    pdf.text(db?.customer.name, 10, 60);
    pdf.text(db?.customer.address, 10, 65);
    pdf.text(`Credit: ${db?.customer.Credit}`, 10, 80);

    // Add Sold by
    pdf.setFontSize(14);
    pdf.setFont("", "bold");
    pdf.text("Sold by", 120, 50);
    pdf.setFont("", "normal");
    pdf.setFontSize(12);
    pdf.text("SBC Home Needs", 120, 60);
    pdf.text("1st Floor, ABC Building", 120, 65);
    pdf.text("Palakkad", 120, 70);
    pdf.text(
      `Invoice Date: ${new Date(db?.createdAt).toDateString()}`,
      120,
      80
    );

    // Add Invoice ID and Date
    pdf.setFontSize(12);
    pdf.text(`Invoice ID: ${db?.id}`, 10, 100);
    pdf.text(`Order Date: ${new Date(db?.createdAt).toDateString()}`, 10, 105);

    // Add Table
    const tableColumn = [
      "S.No",
      "Item Name",
      "HSN/SAC Code",
      "Price",
      "Quantity",
      "Net Amount",
      "Tax",
      "Total",
    ];
    const tableRows: any = [];

    quantity?.forEach((qt: any, i: number) => {
      tableRows.push([
        i + 1,
        qt.itemname,
        "---",
        qt.price,
        qt.qty,
        Number(qt?.price) * Number(qt?.qty),
        `${qt.tax}%`,
        qt.inditotal,
      ]);
    });

    // Type assertion for jsPDF instance to include autoTable
    (pdf as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 120,
      theme: "grid",
    });
    const sectableRows: any = [];
    let lengthof = (db?.total).toString().length;
    lengthof = lengthof > 5 ? lengthof : 0;
    sectableRows.push([
      `${" ".repeat(145 - lengthof)}Grand Total: ${db?.total}/-`,
    ]); // Wrap in an array for a single column
    sectableRows.push([`Amount in Words: ${amountInWords} Only`]);

    let a = pdf.lastAutoTable.finalY;

    (pdf as any).autoTable({
      head: [],
      body: sectableRows,

      startY: a,
      theme: "grid",
    });

    // Save the PDF

    if (ac === "pdf") {
      pdf.save(`Delivery Challan_No_${db?.id}-${crypto.randomUUID()}.pdf`);
    } else if (ac === "view") {
      // Trigger autoPrint and then open the print dialog
      pdf.output("pdfobjectnewwindow");
    } else if (ac === "print") {
      // Trigger autoPrint and then open the print dialog
      pdf.autoPrint();
      pdf.output("pdfobjectnewwindow");
    }
  };

  return (
    <div className="w-full md:w-4/5 mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg relative">
      <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-3 pb-5">
        <Button
          className="self-end mt-4 bg-green-500 text-white hover:bg-green-700"
          onClick={() => handleDownloadPDF("view")}
        >
          View PDF
        </Button>
        <Button
          className="self-end mt-4 bg-slate-700 text-white hover:bg-slate-500"
          onClick={() => handleDownloadPDF("pdf")}
        >
          DOWNLOAD PDF
        </Button>

        <Button
          className="self-end mt-4 bg-red-500 text-white hover:bg-red-700"
          onClick={() => handleDownloadPDF("print")}
        >
          Print PDF
        </Button>
      </div>
      <div className="flex  mb-6">
        <Image src="/4thepeoplelogo.jpeg" alt="logo" width={200} height={100} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
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
          <p>Created At: {new Date(db?.createdAt).toDateString()}</p>
        </div>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      <h1 className="font-semibold text-lg">Invoice ID: {db?.id}</h1>
      <h1 className="mb-4">
        Created At: {new Date(db?.createdAt).toDateString()}
      </h1>

      <Table className="mt-4 w-full">
        <TableHeader className="bg-teal-300">
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Item Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quantity?.map((qt: any, i: number) => (
            <TableRow key={i} className="hover:bg-gray-100">
              <TableCell>{i + 1}</TableCell>
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
    </div>
  );
}

export default ViewTable;
