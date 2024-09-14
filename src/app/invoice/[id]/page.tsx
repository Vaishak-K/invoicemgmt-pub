import { ExtractInvoiceData } from "@/components/ExtractCustomerData";
import React from "react";
import ViewTable from "../_components/DownloadPDF";
import Link from "next/link";
export const runtime = "edge";

async function page({ params }: any) {
  const db = await ExtractInvoiceData(params?.id);

  // Log the db object to debug
  // console.log("Fetched Data:", db);

  // Check if db.payments exists and is an array
  const payments = Array.isArray(db?.Payments) ? db?.Payments : [];
  console.log("Invoice Credit:", db?.credit);
  // console.log("Payments Data:", payments);
  console.log("Payments", payments);
  return (
    <div>
      <ViewTable db={db} />
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Invoice Details
        </h1>
        {payments.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-teal-100">
                <tr>
                  <th className="p-3 border border-gray-300 text-left">
                    Payment ID
                  </th>
                  <th className="p-3 border border-gray-300 text-right">
                    Amount
                  </th>
                  <th className="p-3 border border-gray-300 text-right">
                    Created At
                  </th>
                  <th className="p-3 border border-gray-300 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay: any) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 border border-gray-300">{pay.id}</td>
                    <td className="p-3 border border-gray-300 text-right">
                      {pay.amount.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-300 text-right">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      <Link
                        href={`/payments/${pay.id}`}
                        className="text-teal-600 hover:underline"
                      >
                        Click to View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No Payment found for this customer.
          </p>
        )}
      </div>
    </div>
  );
}

export default page;
