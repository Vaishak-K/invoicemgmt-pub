import PageHeader from "@/components/PageHeader";
import React from "react";
import CustomerForm from "../../_components/PaymentsForm";
import { number } from "zod";

import ExpenseForm from "../../_components/PaymentsForm";
import PaymentsForm from "../../_components/PaymentsForm";

import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
type EditProps = {
  params: {
    id: string;
  };
};

async function Edit({ params }: EditProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const id = params.id;
  const { data: payments, error } = await supabase
    .from("Payments") // Replace 'payments' with the actual table name
    .select("*, Customer(*)") // Select all columns (or specify specific columns)
    .eq("id", id) // Filter by the unique 'id' field
    .single(); // Ensure only one record is returned

  if (error) {
    console.error("Error retrieving payment:", error);
  } else {
    console.log("Payment:", payments);
  }

  return (
    <div>
      <PageHeader message="Edit Page" />
      <PaymentsForm payments={payments} />
    </div>
  );
}

export default Edit;
