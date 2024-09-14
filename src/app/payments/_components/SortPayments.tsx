import { supabase } from "@/lib/supabase";

export async function ChangePayments(sortOption: any) {
  let query = supabase.from("Payments").select("*, Customer(*)");

  // Apply sorting based on the sortOption
  if (sortOption === "priceAsc") {
    query = query.order("amount", { ascending: true });
  } else if (sortOption === "priceDesc") {
    query = query.order("amount", { ascending: false });
  } else if (sortOption === "nameAsc") {
    query = query.order("customername", { ascending: true });
  } else if (sortOption === "nameDesc") {
    query = query.order("customername", { ascending: false });
  }

  // Execute the query and get the data
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching payments:", error);
    return null; // Handle error appropriately
  }

  return data;
}
