import PageHeader from "@/components/PageHeader";
import React from "react";
import CustomerForm from "../../_components/ExpenseForm";
import { number } from "zod";

import ExpenseForm from "../../_components/ExpenseForm";

import { createClient } from "@supabase/supabase-js";

type EditProps = {
  params: {
    id: string;
  };
};
export const runtime = "edge";

async function Edit({ params }: EditProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const id = params.id;
  const { data: expenses, error } = await supabase
    .from("Expenses")
    .select("*") // Select all columns, you can adjust it if you only need specific columns
    .eq("id", id) // Filter by id
    .single(); // Ensures you get a single record

  if (error) {
    console.error("Error fetching expense:", error);
    return null; // or handle the error accordingly
  }

  return (
    <div>
      <PageHeader message="Edit Page" />
      <ExpenseForm expenses={expenses} />
    </div>
  );
}

export default Edit;
