import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { createClient } from "@supabase/supabase-js";

type CustomerProps = {
  params: {
    id: string;
  };
};

export const runtime = "edge";

async function page({ params }: CustomerProps) {
  const id = params.id;
  const fontcss = "text-lg font-normal text-gray-700";
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  // Get customer data along with invoices and payments
  const { data: customer, error } = await supabase
    .from("Customer") // The name of your customer table
    .select(
      `
      id,
      name,
      address,
      phone,
      Email,
      GST,
      Credit,
      createdAt,
      Invoices:Invoices(id, total, createdAt),  
      Payments:Payments(id, amount, createdAt, paymentreason)  
    `
    )
    .eq("id", id)
    .single(); // Find customer by ID

  if (error) {
    console.error(error);
    return <p>Error loading customer data</p>;
  }
  console.log("Customer Dta", customer);
  return (
    <div className="max-w-4xl mx-auto py-4 sm:p-6">
      {/* Customer Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Customer Information
        </h1>
        <div className="text-center">
          <h2 className={cn(fontcss, "text-teal-600")}>
            Name: {customer?.name}
          </h2>
          <h2 className={fontcss}>Address: {customer?.address}</h2>
          <h2 className={fontcss}>Email: {customer?.Email}</h2>
          <h2 className={fontcss}>Phone: {Number(customer?.phone)}</h2>
          <h2 className={fontcss}>GST: {customer?.GST || "No GST"}</h2>
          <h2 className={fontcss}>
            Created At: {new Date(customer?.createdAt).toLocaleDateString()}
          </h2>
          <h2 className={cn(fontcss, "text-teal-600")}>
            Credit: {customer?.Credit}
          </h2>
        </div>
      </div>

      {/* Invoice Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Invoice Details
        </h1>
        {customer?.Invoices?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-teal-100">
                <tr>
                  <th className="p-3 border border-gray-300 text-left">
                    Invoice ID
                  </th>
                  <th className="p-3 border border-gray-300 text-right">
                    Total Amount
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
                {customer.Invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 border border-gray-300">{inv.id}</td>
                    <td className="p-3 border border-gray-300 text-right">
                      {inv.total.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-300 text-right">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      <Link
                        href={`/invoice/${inv.id}`}
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
            No invoices found for this customer.
          </p>
        )}
      </div>

      {/* Payment Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
        {customer?.Payments?.length ? (
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
                    Reason
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
                {customer.Payments.map((pay: any) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 border border-gray-300">{pay.id}</td>
                    <td className="p-3 border border-gray-300 text-right">
                      {pay.amount.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-300 text-right">
                      {pay.paymentreason}
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
            No payments found for this customer.
          </p>
        )}
      </div>
    </div>
  );
}

export default page;
