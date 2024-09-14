import React from "react";

import DeliveryChallanView from "./_components/DeliveryChallanView";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

async function page() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  // Fetch DeliveryChallan data, correctly using customerid
  const { data: addData, error: addDataError } = await supabase
    .from("DeliveryChallan")
    .select("id, total, createdAt, updatedAt, customerid"); // Use customerid here

  if (addDataError) {
    console.error("Error fetching DeliveryChallan data:", addDataError);
    return null; // Handle error
  }

  // Fetch related Customer data using customerid
  const customerIds = addData.map((item) => item.customerid);

  const { data: customerData, error: customerError } = await supabase
    .from("Customer")
    .select("*")
    .in("id", customerIds); // Using customerid to fetch customers

  if (customerError) {
    console.error("Error fetching customer data:", customerError);
    return null; // Handle error
  }

  // Fetch linked Invoice IDs from the junction table (_DeliveryChallanToInvoices)
  const { data: linkedInvoices, error: linkedInvoicesError } = await supabase
    .from("_DeliveryChallanToInvoices")
    .select("A, B") // A = DeliveryChallan ID, B = Invoice ID
    .in(
      "A",
      addData.map((item) => item.id)
    ); // Filter by DeliveryChallan IDs
  if (linkedInvoicesError) {
    console.error("Error fetching linked invoices:", linkedInvoicesError);
    return null; // Handle error
  }

  // Fetch Invoice details using the Invoice IDs
  const invoiceIds = linkedInvoices.map((link) => link.B);

  const { data: invoiceData, error: invoiceError } = await supabase
    .from("Invoices")
    .select("*")
    .in("id", invoiceIds); // Fetch invoices linked to the DeliveryChallan

  if (invoiceError) {
    console.error("Error fetching invoice data:", invoiceError);
    return null; // Handle error
  }

  // Combine everything together (DeliveryChallan + Customer + Invoices)
  const result = addData.map((item) => {
    // Find the related customer based on customerid
    const customer = customerData.find((cust) => cust.id === item.customerid);

    // Find the linked invoices for this DeliveryChallan item
    const invoicesForChallan = linkedInvoices
      .filter((link) => link.A === item.id) // Filter by DeliveryChallan ID
      .map((link) => invoiceData.find((inv) => inv.id === link.B)); // Find the corresponding invoices by ID

    return {
      ...item, // Spread the DeliveryChallan data
      customer, // Add the related customer
      invoices: invoicesForChallan, // Add the related invoices
    };
  });

  // console.log("Combined Data:", result);

  return (
    <div>
      <DeliveryChallanView addData={result} />
    </div>
  );
}

export default page;
