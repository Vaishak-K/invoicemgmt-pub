// If you have a search input component

import ItemsView from "./_components/ItemsView";
import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

export default async function Items() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: itemsData, error } = await supabase.from("Item").select("*");

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg">
      <ItemsView itemsData={itemsData} />
    </div>
  );
}
