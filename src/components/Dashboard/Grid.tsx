import React from "react";
import { StatCards } from "./StatCards";
import { ActivityGraph } from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import { RecentTransactions } from "./RecentTransactions";

import { createClient } from "@supabase/supabase-js";

export const Grid = async () => {
  const date = new Date();

  let data = []; // Initialize data as an empty array

  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  // Loop through the last 6 months
  for (let i = -5; i <= 0; i++) {
    let startDate = new Date(date.getFullYear(), date.getMonth() + i, 1);
    let endDate = new Date(date.getFullYear(), date.getMonth() + i + 1, 0);

    // Query for customer data based on invoices (Aggregating Credit)
    const { data: customerData, error: customerError } = await supabase
      .from("Invoices")
      .select("id, Credit, Invoices(updatedAt)") // Selecting related Invoices table
      .gte("Invoices.updatedAt", startDate.toISOString()) // Filtering on Invoices.updatedAt
      .lte("Invoices.updatedAt", endDate.toISOString()); // Filtering on Invoices.updatedAt
    // console.log("Customer Data:", customerData);
    // console.log("Customer Data", customerData);
    const totalCredit =
      customerData?.reduce((sum, customer) => {
        return sum + (customer?.Credit || 0);
      }, 0) || 0;
    // console.log(
    //   "Total Credit:",
    //   totalCredit,
    //   "Date Start",
    //   startDate.toDateString(),
    //   "Date end",
    //   endDate.toDateString()
    // );
    // Query for payment data within the same time range (Aggregating amount)
    // console.log("Total Credit", totalCredit);
    const { data: paymentData } = await supabase
      .from("Payments") // Assuming 'Payments' is the table name
      .select("*") // Selecting the 'amount' column
      .gte("createdAt", startDate.toISOString()) // Start date filter
      .lte("createdAt", endDate.toISOString()); // End date filter

    // console.log("Payment Dtaa", paymentData);
    const totalPayment =
      paymentData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    // Store the results in the `data` array for each month
    let monthData = {
      name: `Month: ${6 + i}`, // Month number relative to current month
      Credit: totalCredit,
      Payment: totalPayment,
    };

    // Add the result to the data array
    data.push(monthData);
  }
  // console.log("Month Data:", data);
  return (
    <div className="px-4">
      <StatCards />
      <ActivityGraph data={data} />
      {/* <UsageRadar /> */}
      <RecentTransactions />
    </div>
  );
};
