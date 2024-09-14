"use server";

import { supabase } from "@/lib/supabase"; // Ensure supabase client is initialized

export async function SortItems(sortOption: any) {
  let adddata: any;

  // Sorting by price (ascending)
  if (sortOption === "priceAsc") {
    const { data, error } = await supabase
      .from("Item") // Your table name
      .select("*") // Select all columns or specify specific ones
      .order("price", { ascending: true }); // Sorting price in ascending order

    if (error) {
      throw error;
    }

    adddata = data;
  }
  // Sorting by price (descending)
  else if (sortOption === "priceDesc") {
    const { data, error } = await supabase
      .from("Item")
      .select("*")
      .order("price", { ascending: false });

    if (error) {
      throw error;
    }

    adddata = data;
  }
  // Sorting by item name (ascending)
  else if (sortOption === "nameAsc") {
    const { data, error } = await supabase
      .from("Item")
      .select("*")
      .order("itemname", { ascending: true });

    if (error) {
      throw error;
    }

    adddata = data;
  }
  // Sorting by item name (descending)
  else if (sortOption === "nameDesc") {
    const { data, error } = await supabase
      .from("Item")
      .select("*")
      .order("itemname", { ascending: false });

    if (error) {
      throw error;
    }

    adddata = data;
  }
  // Default case: fetching all items without sorting
  else {
    const { data, error } = await supabase.from("Item").select("*");

    if (error) {
      throw error;
    }

    adddata = data;
  }

  return adddata;
}
