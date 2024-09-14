"use server";
import { createClient } from "@supabase/supabase-js";
import React from "react";
// export const runtime = "edge";

export async function ExtractCustomerData() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: customer_details } = await supabase
    .from("Customer")
    .select("*");
  return customer_details;
}

export async function ExtractInvoiceData(invoiceid: any) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: invoice_details, error } = await supabase
    .from("Invoices")
    .select(
      "*, Customer:customerid(*),  Payments:Payments(id, amount, createdAt, paymentreason)"
    ) // Select the invoice with related customer and payments
    .eq("id", invoiceid)
    .single(); // Ensure we get a single record (not an array)

  if (error) {
    console.error("Error fetching invoice data:", error);
    return null; // Return null in case of an error
  }

  console.log("Invoice Details:", invoice_details);
  return invoice_details;
}

export async function ExtractEstimateData(estimateid: any) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: estimate_details, error } = await supabase
    .from("Estimates")
    .select("*, customer:Customer(*)")
    .eq("id", estimateid)
    .single();

  // Error handling
  if (error) {
    console.error("Error fetching estimate details:", error.message);
    return null;
  }

  return estimate_details;
}

export async function ExtractItemsData() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: item_details, error } = await supabase
    .from("item") // Assuming the table name is 'item'
    .select("*"); // Adjust columns as necessary

  if (error) {
    console.error("Error fetching item details:", error);
    return []; // Handle error appropriately
  }

  return item_details; // Returns the data
}

export async function ExtractChallanData(challanid: any) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  // Fetch DeliveryChallan by ID
  const { data: challan_details, error: challanError } = await supabase
    .from("DeliveryChallan") // Assuming 'deliveryChallan' is the table name
    .select("*")
    .eq("id", challanid)
    .single(); // Assuming you're expecting a single result

  if (challanError) {
    console.error("Error fetching delivery challan details:", challanError);
    return null;
  }

  // Fetch related customer data (using 'customerid' field for the relationship)
  const { data: customer_data, error: customerError } = await supabase
    .from("Customer") // Assuming 'customer' is the table name
    .select("*")
    .eq("id", challan_details.customerid) // Adjust field for customer relation
    .single(); // Assuming one customer per challan

  if (customerError) {
    console.error("Error fetching customer details:", customerError);
  }

  // Fetch related invoices for this delivery challan
  const { data: invoice_data, error: invoiceError } = await supabase
    .from("Invoices") // Assuming 'invoices' is the table name
    .select("*")
    .eq("deliveryChallanId", challanid); // Assuming a foreign key `deliveryChallanId` on invoices

  if (invoiceError) {
    console.error("Error fetching invoice details:", invoiceError);
  }

  return {
    ...challan_details, // DeliveryChallan data
    customer: customer_data, // Customer data
    invoices: invoice_data, // Invoice data
  };
}
