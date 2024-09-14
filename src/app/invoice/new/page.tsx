import PageHeader from "@/components/PageHeader";
import React from "react";
import Invoices from "../_components/InvoiceForm";

import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

async function NewPage() {
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

  return (
    <div>
      <PageHeader message="New Invoice Page" />
      <Invoices db={db} customerdb={customerdb} />
    </div>
  );
}

export default NewPage;
