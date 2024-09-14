import { createClient } from "@supabase/supabase-js";
import CustomerView from "./_components/CustomerView";

export const runtime = "edge";

export default async function Customer() {
  let addData: any;
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: customer } = await supabase.from("Customer").select("*");

  return (
    <div>
      {/* <pre>{JSON.stringify(customer, null, 2)}</pre> */}
      <CustomerView addData={customer} />
    </div>
  );
}
