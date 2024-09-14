import PageHeader from "@/components/PageHeader";
import React from "react";

import Estimates from "../../_components/EstimateForm";
import { createClient } from "@supabase/supabase-js";

type EditPageProps = {
  params: {
    id: String;
  };
};
export const runtime = "edge";

async function EditPage({ params }: EditPageProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: items, error: itemsError } = await supabase
    .from("Item")
    .select("*");

  if (itemsError) {
    console.error("Error fetching items:", itemsError.message);
    return;
  }

  // Fetch all customers
  const { data: customers, error: customersError } = await supabase
    .from("Customer")
    .select("*");

  if (customersError) {
    console.error("Error fetching customers:", customersError.message);
    return;
  }

  // Fetch a specific estimate and include customer details
  const { data: estimateData, error: estimateError } = await supabase
    .from("Estimates")
    .select("*, customer:Customer(*)")
    .eq("id", params.id)
    .single();

  if (estimateError) {
    console.error("Error fetching estimate:", estimateError.message);
    return;
  }

  console.log("Items:", items);
  console.log("Customers:", customers);
  console.log("Estimate Data:", estimateData);

  return (
    <div>
      <PageHeader message="Edit Estimate Page" />
      <Estimates estimate={estimateData} db={items} customerdb={customers} />
    </div>
  );
}

export default EditPage;
