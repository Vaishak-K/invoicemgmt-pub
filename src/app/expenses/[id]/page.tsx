import Link from "next/link";

import { cn } from "@/lib/utils";

import { createClient } from "@supabase/supabase-js";

type ExpenseProps = {
  params: {
    id: string;
  };
};
export const runtime = "edge";

async function page({ params }: ExpenseProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const id = params.id;
  const fontcss = "text-lg font-normal text-gray-700";
  const { data: expense, error } = await supabase
    .from("Expenses")
    .select("*") // Select all columns, you can adjust it if you only need specific columns
    .eq("id", id) // Filter by id
    .single(); // Ensures you get a single record

  if (error) {
    console.error("Error fetching expense:", error);
    return null; // or handle the error accordingly
  }

  console.log(expense); // The fetched expense data

  return (
    <div className="max-w-4xl mx-auto py-4 sm:p-6">
      {/* Customer Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Detailed Expense Information
        </h1>
        <div className="text-center">
          <h2 className={cn(fontcss, "text-teal-600")}>
            Name: {expense?.empname}
          </h2>
          <h2 className={fontcss}>Reason: {expense?.reason}</h2>
          <h2 className={fontcss}>Amount: {expense?.amount}</h2>
          <h2 className={fontcss}>Is Taxable: {String(expense?.isTaxable)}</h2>

          <h2 className={fontcss}>
            Tax Value: {expense?.taxValue || "No Tax Applicable"}
          </h2>

          <h2 className={fontcss}>
            Created At: {new Date(expense?.createdAt).toDateString()}
          </h2>
          <h2 className={cn(fontcss, "text-teal-600")}>
            Final Expense: {expense?.finalPrice}
          </h2>
        </div>
      </div>

      {/* Invoice Details Section
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Invoice Details
        </h1>
        {customer?.invoice.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-teal-100">
                <tr>
                  <th className="p-3 border border-gray-300 text-left">
                    Invoice ID
                  </th>
                  <th className="p-3 border border-gray-300 text-right">
                    Total Amount
                  </th>
                  <th className="p-3 border border-gray-300 text-right">
                    Created At
                  </th>
                  <th className="p-3 border border-gray-300 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {customer.invoice.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 border border-gray-300">{inv.id}</td>
                    <td className="p-3 border border-gray-300 text-right">
                      {inv.total.toFixed(2)}
                    </td>
                    <td className="p-3 border border-gray-300 text-right">
                      {inv.createdAt.toDateString()}
                    </td>
                    <td className="p-3 border border-gray-300 text-center">
                      <Link
                        href={`/invoice/${inv.id}`}
                        className="text-teal-600 hover:underline"
                      >
                        Click to View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No invoices found for this customer.
          </p>
        )}
      </div> */}
    </div>
  );
}

export default page;
