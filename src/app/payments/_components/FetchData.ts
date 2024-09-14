"use server";

import { supabase } from "@/lib/supabase";

// Make sure to initialize Supabase client

// Function to get all customers with their name and credit
export async function GetNames() {
  const { data, error } = await supabase
    .from("Customer") // Assuming your table is called 'Customer'
    .select("id, name, Credit"); // Adjust the column names as needed

  if (error) {
    console.error("Error fetching customers:", error);
    return null; // Handle error appropriately
  }

  return data; // Return the list of customers
}

// Function to get customer invoices based on customer id
interface CustomerWithInvoice {
  invoice: any[] | null; // Adjust this according to your schema
}

export async function GetInvoice(
  id: number
): Promise<CustomerWithInvoice | null> {
  const { data, error } = await supabase
    .from("Customer") // Assuming the table is called 'Customer'
    .select("Invoices(*)") // Fetching related invoice fields
    .eq("id", id)
    .single(); // Ensures only one customer is returned

  if (error) {
    console.error("Error fetching invoices for customer:", error);
    return null; // Return null if there's an error
  }

  // If the structure from Supabase is nested under "Invoice" instead of "invoice", adjust here:
  return { invoice: data?.Invoices || null }; // Ensure that 'invoice' is returned correctly
}

// Function to get specific invoices by their ids
export async function Invoice(ids: number[]) {
  const { data, error } = await supabase
    .from("Invoices") // Assuming your table is called 'Invoices'
    .select("id, quantity") // Select the required fields, adjust as needed
    .in("id", ids); // Fetch invoices where the ID is in the provided list

  if (error) {
    console.error("Error fetching invoices:", error);
    return null; // Handle error appropriately
  }

  return data; // Return the list of invoices
}
