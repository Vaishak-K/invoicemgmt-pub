import PageHeader from "@/components/PageHeader";
import React from "react";
import Invoices from "@/app/invoice/_components/InvoiceForm";

import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";
type EditPageProps = {
  params: {
    id: String;
  };
};

async function EditPage({ params }: EditPageProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: db, error: itemsError } = await supabase
    .from("Item") // The table name for "Item"
    .select("*"); // Select all columns
  const { data: customerdb, error: customersError } = await supabase
    .from("Customer") // The table name for "Customer"
    .select("*");
  const { data: invoice, error } = await supabase
    .from("Invoices")
    .select("*, Payments(*), Customer(*)")
    .eq("id", params.id)
    .single();

  return (
    <div>
      <PageHeader message="Edit Invoice Page" />
      <Invoices invoice={invoice} db={db} customerdb={customerdb} />
    </div>
  );
}

export default EditPage;
