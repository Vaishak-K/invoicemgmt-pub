import React from "react";

import PageHeader from "@/components/PageHeader";

import ExpensesView from "./_components/ExpensesView";

import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

async function page() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: addData, error: expensesError } = await supabase
    .from("Expenses") // Specify the table name
    .select("*"); // Select all columns

  if (expensesError) {
    console.error("Error fetching expenses:", expensesError.message);
    return;
  }

  //   console.log("Expenses Data:", addData);
  return (
    <div>
      {/* <h1 className="pt-5">Welcome to the Expenses Page</h1> */}

      <ExpensesView addData={addData} />
    </div>
  );
}

export default page;
