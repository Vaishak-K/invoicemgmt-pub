import PageHeader from "@/components/PageHeader";
import React from "react";

import DeliveryChallanForm from "../../_components/DeliveryChallanForm";

import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";
type EditProps = {
  params: {
    id: string;
  };
};

async function Edit({ params }: EditProps) {
  const id = params.id;
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: challan, error: challanError } = await supabase
    .from("DeliveryChallan") // 'DeliveryChallan' is the table name
    .select("*")
    .eq("id", id)
    .single(); // Fetch single row by id

  if (challanError) {
    console.error("Error fetching delivery challan:", challanError);
    return null;
  }

  // Step 2: Fetch the related Customer data using the `customerid` from the DeliveryChallan
  const { data: customer, error: customerError } = await supabase
    .from("Customer") // 'Customer' is the table name
    .select("*")
    .eq("id", challan.customerid) // Assuming the foreign key is `customerid`
    .single(); // Fetch single row by customer id

  if (customerError) {
    console.error("Error fetching customer data:", customerError);
    return null;
  }

  // Step 3: Fetch related Invoices for this DeliveryChallan
  // Adjust the foreign key name here (replace `deliveryChallanId` with the actual column name in your schema)
  const { data: invoices, error: invoiceError } = await supabase
    .from("Invoices") // 'Invoices' is the table name
    .select("*");
  // Replace with the correct foreign key in the 'Invoices' table

  if (invoiceError) {
    console.error("Error fetching invoices:", invoiceError);
    return null;
  }

  // Step 4: Combine all the data (Challan, Customer, Invoices)
  const result = {
    challanData: challan, // DeliveryChallan data
    customerData: customer, // Customer data
    invoiceData: invoices, // Invoices data
  };

  // console.log("Results", result);
  return (
    <div>
      <PageHeader message="Edit Page" />
      <DeliveryChallanForm challan={result} />
    </div>
  );
}

export default Edit;
