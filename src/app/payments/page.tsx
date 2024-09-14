import React from "react";

import PaymentsView from "./_components/PaymentsView";
import { add } from "lodash";

import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

async function page() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: addData, error: addDataError } = await supabase
    .from("Payments") // The table you are querying from
    .select("*, Customer(*)"); // Fetch all columns from 'payments' and related 'customer' data

  if (addDataError) {
    console.error("Error fetching payment data:", addDataError);
    return null;
  }
  // console.log("Payments page", addData);
  return (
    <div>
      <PaymentsView addData={addData} />
      {/* <h1 className="pt-5">Welcome to the Expenses Page</h1> */}
    </div>
  );
}

export default page;
