"use server";
import { supabase } from "@/lib/supabase";

export async function ChangeChallan(sortOption: string) {
  let adddata: any;

  // Switch block to handle different sorting options
  if (sortOption === "priceAsc") {
    const { data, error } = await supabase
      .from("DeliveryChallan")
      .select("*")
      .order("total", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    adddata = data;
  } else if (sortOption === "priceDesc") {
    const { data, error } = await supabase
      .from("DeliveryChallan")
      .select("*")
      .order("total", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    adddata = data;
  } else if (sortOption === "nameAsc") {
    const { data, error } = await supabase
      .from("DeliveryChallan")
      .select("*")
      .order("customer.name", { ascending: true })
      .eq("customer", "Customer"); // Ensures we're sorting by customer name

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    adddata = data;
  } else if (sortOption === "nameDesc") {
    const { data, error } = await supabase
      .from("DeliveryChallan")
      .select("*")
      .order("customer.name", { ascending: false })
      .eq("customer", "Customer"); // Ensures we're sorting by customer name

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    adddata = data;
  } else {
    // Default to fetching all delivery challans with customer and invoice details
    const { data, error } = await supabase
      .from("DeliveryChallan")
      .select("*")
      .eq("customer", "Customer") // Ensuring we're referencing the customer table
      .eq("invoice", "Invoices"); // Ensuring we're referencing the invoice table

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }

    adddata = data;
  }

  return adddata;
}
