"use server";

import { supabase } from "@/lib/supabase";

export async function ChangeExpense(sortOption: any) {
  let adddata: any;

  let query = supabase.from("Expenses").select("*");

  if (sortOption === "priceAsc") {
    query = query.order("finalPrice", { ascending: true });
  } else if (sortOption === "priceDesc") {
    query = query.order("finalPrice", { ascending: false });
  } else if (sortOption === "nameAsc") {
    query = query.order("empname", { ascending: true });
  } else if (sortOption === "nameDesc") {
    query = query.order("empname", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error.message);
    return;
  }

  adddata = data;
  return adddata;
}
