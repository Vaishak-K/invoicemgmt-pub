"use server";
import { supabase } from "@/lib/supabase";

export async function ChangeName(sortOption: any) {
  let adddata: any;

  if (sortOption === "creditAsc") {
    const { data: addData, error } = await supabase
      .from("Customer")
      .select("*")
      .order("Credit", { ascending: true });
    adddata = addData;
  } else if (sortOption === "creditDesc") {
    const { data: addData, error } = await supabase
      .from("Customer")
      .select("*")
      .order("Credit", { ascending: false });
    adddata = addData;
  } else if (sortOption === "nameAsc") {
    const { data: addData, error } = await supabase
      .from("Customer")
      .select("*")
      .order("name", { ascending: true });
    adddata = addData;
  } else if (sortOption === "nameDesc") {
    const { data: addData, error } = await supabase
      .from("Customer")
      .select("*")
      .order("name", { ascending: false });
    adddata = addData;
  } else {
    const { data: addData } = await supabase.from("Customer").select("*");
    adddata = addData;
  }

  // console.log("AddData inside ChangeNAme", adddata);
  return adddata;
}
