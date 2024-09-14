import {
  ExtractChallanData,
  ExtractInvoiceData,
} from "@/components/ExtractCustomerData";
import React from "react";
import ViewTable from "../_components/DownloadPDF";

export const runtime = "edge";
async function page({ params }: any) {
  const db = await ExtractChallanData(params?.id);
  console.log("Total", db?.total);
  return (
    <div>
      <ViewTable db={db} />
    </div>
  );
}

export default page;
