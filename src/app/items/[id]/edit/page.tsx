import PageHeader from "@/components/PageHeader";
import React from "react";

import ItemForm from "../../_components/ItemForm";

import { createClient } from "@supabase/supabase-js";

type EditProps = {
  params: {
    id: String;
  };
};
export const runtime = "edge";

async function Edit({ params }: EditProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const id = params.id;
  const { data: item, error } = await supabase
    .from("Item") // Replace with your table name
    .select("*") // Select all columns or specify columns (e.g., 'id', 'itemname', etc.)
    .eq("id", id) // Use `.eq()` to filter by `id`
    .single();

  return (
    <div>
      <PageHeader message="Edit Page" />
      <ItemForm item={item} />
    </div>
  );
}

export default Edit;
