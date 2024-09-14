"use server";
import { object, z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { tree } from "next/dist/build/templates/app-page";
import { disconnect } from "process";
import { supabase } from "@/lib/supabase";

// const itemAddSchema = z.object({
//   itemid: z.coerce.number().int().min(1, { message: "Enter an Item ID" }),
//   itemname: z.string().min(1),
//   price: z.coerce.number().int().min(1),
//   qty: z.coerce.number().int().min(1),
//   tax: z.coerce.number().int().min(1),
//   inditotal: z.coerce.number(),
// });
// export const runtime = "edge";
const ChallanAddSchema = z.object({
  customerid: z.string().min(1, { message: "Enter a Customer ID" }),
  invoiceid: z
    .array(z.string())
    .min(1, { message: "Select at least one Invoice" }),
});

//Invoice Adding Function

export async function AddDeliveryChallan(arr: any) {
  // Parse and validate the input data
  const { data: parsedData, error: parseError } =
    ChallanAddSchema.safeParse(arr);
  if (parseError) return parseError.formErrors.fieldErrors;
  console.log("Parsed Data", parsedData);
  // Fetch customer details and invoices from Supabase
  const { data: customerdetails, error: customerError } = await supabase
    .from("Customer")
    .select("id, Invoices(id, quantity, total)")
    .eq("id", parsedData?.customerid)
    .single();
  console.log("Customer Details", customerdetails);
  if (customerError) {
    console.error("Error fetching customer:", customerError);
    return;
  }

  // Combine the invoice quantities and calculate total
  let total = 0;
  let idconnect: any = [];
  let invoicecombine: any = [];

  customerdetails?.Invoices?.forEach((invoice1: any) => {
    if (parsedData?.invoiceid.includes(invoice1?.id)) {
      invoicecombine = invoicecombine.concat(JSON.parse(invoice1?.quantity));
      total += invoice1?.total;
      idconnect.push({ id: invoice1?.id });
    }
  });

  // Create the new Delivery Challan
  const { data: deliveryChallan, error: challanError } = await supabase
    .from("DeliveryChallan")
    .insert([
      {
        customerid: customerdetails?.id,
        total: total,
        quantity: JSON.stringify(invoicecombine),
      },
    ])
    .select();

  if (challanError) {
    console.error("Error creating Delivery Challan:", challanError);
    return;
  }

  // Link invoices to the newly created delivery challan
  // const { data: linkedInvoices, error: invoiceError } = await supabase
  //   .from("_DeliveryChallanToInvoices") // Assuming you have this junction table
  //   .insert(
  //     idconnect.map((invoice: any) => ({
  //       deliveryChallanid: deliveryChallan[0].id,
  //       invoiceid: invoice.id,
  //     }))
  //   );

  // if (invoiceError) {
  //   console.error("Error linking invoices to Delivery Challan:", invoiceError);
  //   return invoiceError.message;
  // }

  // Revalidate paths and redirect
  revalidatePath("/deliverychallan");
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/deliverychallan");
}

// **Update Delivery Challan Function**
export async function UpdateDeliveryChallan(id: any, arr: any) {
  // Parse and validate the input data
  const { data: parsedData, error: parseError } =
    ChallanAddSchema.safeParse(arr);
  if (parseError) return parseError.formErrors.fieldErrors;

  // Fetch customer details and related invoices
  const { data: customerdetails, error: customerError } = await supabase
    .from("Customer")
    .select("id, Invoices(id, quantity, total)")
    .eq("id", parsedData?.customerid)
    .single();

  if (customerError) {
    console.error("Error fetching customer:", customerError);
    return;
  }

  // Calculate total and prepare invoice data
  let total = 0;
  let idconnect: any = [];
  let invoicecombine: any = [];
  console.log("Parsed Data invice", parsedData?.invoiceid);
  customerdetails?.Invoices?.forEach((invoice1: any) => {
    // console.log("Invoice1 id", invoice1?.id);
    // console.log(
    //   "Is invoice1 in parsed?",
    //   parsedData?.invoiceid.includes(invoice1?.id)
    // );
    if (parsedData?.invoiceid.includes(invoice1?.id)) {
      invoicecombine = invoicecombine.concat(JSON.parse(invoice1?.quantity));
      total += invoice1?.total;
      idconnect.push({ id: invoice1?.id });
    }
  });
  console.log("invoiceCombine", invoicecombine);
  // Update the Delivery Challan
  const { data: updatedChallan, error: updateError } = await supabase
    .from("DeliveryChallan")
    .update([
      {
        customerid: parsedData?.customerid,
        total: total,
        quantity: JSON.stringify(invoicecombine),
      },
    ])
    .eq("id", id)
    .select("*");

  if (updateError) {
    console.error("Error updating Delivery Challan:", updateError);
  }
  console.log("Delivery Challan Updated:", updatedChallan);

  revalidatePath("/deliverychallan");
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/deliverychallan");
}

// **Delete Delivery Challan Function**
export async function DeleteChallan(challan: string) {
  const { data: delchallan, error: deleteError } = await supabase
    .from("DeliveryChallan")
    .delete()
    .eq("id", challan);

  if (deleteError) {
    console.error("Error deleting Delivery Challan:", deleteError);
  }

  // Optionally, handle additional operations like deleting linked invoices, etc.
  const { data: deletedLinks, error: linkDeleteError } = await supabase
    .from("_DeliveryChallanToInvoices") // Junction table that links delivery challans and invoices
    .delete()
    .eq("deliveryChallanId", challan);

  if (linkDeleteError) {
    console.error("Error deleting linked invoices:", linkDeleteError);
    return linkDeleteError.message;
  }

  // Revalidate paths and redirect
  revalidatePath("/deliverychallan");
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/deliverychallan");

  // Return the deleted delivery challan info
}
