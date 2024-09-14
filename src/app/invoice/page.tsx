import InvoiceView from "./_components/InvoiceView";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export default async function Invoices() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: invoicesData, error } = await supabase.from("Invoices").select(`
    *,
    customer:Customer(id, name, Email),  
    payments:Payments(id, amount, modeofpayment) 
  `);

  // console.log("Invoices Data", invoicesData);
  // const { data: invoice } = await supabase
  //   .from("Invoices")
  //   .select("*")
  //   .eq("id", "828ec58c-2a9f-4fa6-841d-b23db8bd6480")
  //   .single();
  // console.log("Deleted Invoice Recovered Data", invoice);
  return (
    <div>
      <InvoiceView invoicesData={invoicesData} />
    </div>
  );
}
