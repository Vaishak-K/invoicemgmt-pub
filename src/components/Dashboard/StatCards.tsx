import Link from "next/link";
import React from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

import { createClient } from "@supabase/supabase-js";

export const StatCards = async () => {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  // Aggregating total Credit from the Customer table
  const { data: customerData, error: customerError } = await supabase
    .from("Customer") // Table name: customer
    .select("Credit"); // Select only the Credit column

  const totalCredit =
    customerData?.reduce((sum, customer) => sum + (customer.Credit || 0), 0) ||
    0;

  if (customerError) {
    console.error("Error fetching customer data:", customerError);
  }

  // Aggregating total amount from the Payments table
  const { data: paymentData, error: paymentError } = await supabase
    .from("Payments") // Table name: payments
    .select("amount"); // Select only the amount column

  const totalPayments =
    paymentData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  if (paymentError) {
    console.error("Error fetching payment data:", paymentError);
  }

  // Getting the last update for payments
  const { data: lastPaymentUpdateData, error: lastPaymentUpdateError } =
    await supabase
      .from("Payments") // Table name: payments
      .select("updatedAt")
      .order("updatedAt", { ascending: false })
      .limit(1); // Get the most recent record

  const lastPaymentUpdate = lastPaymentUpdateData?.[0]?.updatedAt;

  if (lastPaymentUpdateError) {
    console.error(
      "Error fetching last payment update:",
      lastPaymentUpdateError
    );
  }

  // Getting the last update for customers
  const { data: lastCustomerUpdateData, error: lastCustomerUpdateError } =
    await supabase
      .from("Customer") // Table name: customer
      .select("updatedAt")
      .order("updatedAt", { ascending: false })
      .limit(1); // Get the most recent record

  const lastCustomerUpdate = lastCustomerUpdateData?.[0]?.updatedAt;

  if (lastCustomerUpdateError) {
    console.error(
      "Error fetching last customer update:",
      lastCustomerUpdateError
    );
  }

  // Getting the last update for expenses
  const { data: lastExpenseUpdateData, error: lastExpenseUpdateError } =
    await supabase
      .from("Expenses") // Table name: expenses
      .select("updatedAt")
      .order("updatedAt", { ascending: false })
      .limit(1); // Get the most recent record

  const lastExpenseUpdate = lastExpenseUpdateData?.[0]?.updatedAt;

  if (lastExpenseUpdateError) {
    console.error(
      "Error fetching last expense update:",
      lastExpenseUpdateError
    );
  }

  // Aggregating total finalPrice from the Expenses table
  const { data: expenseData, error: expenseError } = await supabase
    .from("Expenses") // Table name: expenses
    .select("finalPrice"); // Select only the finalPrice column

  const totalExpenses =
    expenseData?.reduce((sum, expense) => sum + (expense.finalPrice || 0), 0) ||
    0;

  if (expenseError) {
    console.error("Error fetching expense data:", expenseError);
  }

  return (
    <>
      <div className="grid sm:grid-cols-12">
        <Card
          title="Total Receivables"
          value={`Rs.${totalCredit}`}
          pillText="2.75%"
          trend="up"
          period={`Last Updated:${lastCustomerUpdate}`}
          href="/customer"
        />
        <Card
          title="Total Payments"
          value={`Rs.${totalPayments}`}
          pillText="1.01%"
          trend="down"
          period={`Last Updated:${lastPaymentUpdate}`}
          href="/customer"
        />
        <Card
          title="Total Expenses"
          value={`Rs.${totalExpenses}`}
          pillText="60.75%"
          trend="up"
          period={`Last Updated:${lastExpenseUpdate}`}
          href="/customer"
        />
      </div>
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
  href,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
  href: any;
}) => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300">
      <div className="flex mb-8 items-start justify-between">
        <Link href={href}>
          <div>
            <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
            <p className="text-3xl font-semibold">{value}</p>
          </div>

          <span
            className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
              trend === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {pillText}
          </span>
        </Link>
      </div>

      <p className="text-xs text-stone-500">{period}</p>
    </div>
  );
};
