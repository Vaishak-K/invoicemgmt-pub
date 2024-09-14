import React from "react";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const RecentTransactions = async () => {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: payments, error } = await supabase
    .from("Payments")
    .select(
      `
      id,
      amount,
      createdAt,
      paymentreason,
      customername
    `
    )
    .order("createdAt", { ascending: false }); // Sort by the most recent createdAt

  // Error handling
  if (error) {
    console.error("Error fetching payments:", error);
  }

  // Get the first 10 payments to loop through
  const paymentToLoop = payments?.slice(0, 10);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium text-lg">
          <FiDollarSign /> Recent Payments
        </h3>
        <Link
          href="/payments"
          className="text-sm text-teal-500 hover:underline"
        >
          See all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <TableHead />
          <tbody>
            {paymentToLoop?.map((payment: any, index: number) => {
              return (
                <TableRow
                  key={payment?.id}
                  paymentId={payment?.id}
                  name={payment?.customername}
                  reason={payment?.paymentreason}
                  date={new Date(payment?.createdAt).toDateString()} // Convert createdAt to a readable date string
                  price={payment?.amount}
                  order={index + 1} // Index to alternate row colors
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Payment ID</th>
        <th className="text-start p-1.5">Name</th>
        <th className="text-start p-1.5">Reason</th>
        <th className="text-start p-1.5">Date</th>
        <th className="text-start p-1.5">Price</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  paymentId,
  name,
  reason,
  date,
  price,
  order,
}: {
  paymentId: string;
  name: string;
  reason: string;
  date: string;
  price: string;
  order: number;
}) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <Link
          href={`/payments/${paymentId}`}
          className="text-teal-600 underline flex items-center gap-1"
        >
          {paymentId} <FiArrowUpRight />
        </Link>
      </td>
      <td className="p-1.5">{name}</td>
      <td className="p-1.5">{reason}</td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{price}</td>
      <td className="w-8"></td>
    </tr>
  );
};
