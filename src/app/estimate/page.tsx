import EstimateView from "./_components/EstimateView";
import { createClient } from "@supabase/supabase-js";
export const runtime = "edge";

export default async function Invoices() {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const { data: estimateData, error } = await supabase
    .from("Estimates") // Reference to the 'Estimates' table
    .select("*, customer:Customer(*)"); // Include all columns from 'Estimates' and related 'Customer' data

  // Error handling
  if (error) {
    console.error("Error fetching estimates:", error.message);
    return;
  }

  console.log("Estimate Data:", estimateData);

  // console.log("Invoices Data", invoicesData);
  return (
    <div>
      <EstimateView estimateData={estimateData} />
    </div>
  );
}
