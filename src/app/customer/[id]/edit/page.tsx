import PageHeader from "@/components/PageHeader";
import React from "react";
import CustomerForm from "../../_components/CustomerForm";

import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with environment variables

type EditProps = {
  params: {
    id: string;
  };
};
export const runtime = "edge";
async function Edit({ params }: EditProps) {
  const id = params.id;
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  const { data: customer, error } = await supabase
    .from("Customer") // The name of your table in Supabase
    .select("*") // Select all columns (you can specify specific columns if needed)
    .eq("id", id)
    .single(); // Use `.eq()` to filter based on the unique 'id'
  console.log("customer:", customer);
  return (
    <div>
      <PageHeader message="Edit Page" />
      <CustomerForm customer={customer} />
    </div>
  );
}

export default Edit;
