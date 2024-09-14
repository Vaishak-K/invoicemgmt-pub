"use server";
import { date, object, z } from "zod";
import { supabase } from "@/lib/supabase"; // Assuming supabase.js is properly set up
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Fish } from "lucide-react";

// Define the item and invoice schemas
const itemAddSchema = z.object({
  itemid: z.string().min(1, { message: "Enter an Item ID" }),
  itemname: z.string().min(1),
  price: z.coerce.number().int().min(1),
  qty: z.coerce.number().int().min(1),
  tax: z.coerce.number().int().min(1),
  inditotal: z.coerce.number(),
});

const firstAddSchema = z.object({
  customerid: z.string().min(1, { message: "Enter a Customer ID" }),
  payment: z.string().min(1, { message: "Enter a Payment type" }).optional(),
  total: z.coerce.number(),
  modeofpayment: z
    .string()
    .min(1, { message: "Enter a Mode of Payment" })
    .optional(),
});

type Invoice = {
  id: number; // Adjust types based on your actual schema
  invoiceid: string;
  customerid: number;
  total: number;
  credit: number | null;
  paymentOption: string;
  paymentid: string | null;
  createdAt: string; // TIMESTAMPTZ
  updatedAt: string; // TIMESTAMPTZ
  quantity: string;
};

// export const runtime = "edge";
// Invoice Adding Function
export async function AddInvoice(arr: any, first: any) {
  console.log("Array", arr);
  console.log("First", first);
  const results: any = [];
  let firstResult: any;
  const error: any = [];
  firstResult = firstAddSchema.safeParse(first);
  let errorTrue = false;
  arr.map((indi: any) => {
    results.push(itemAddSchema.safeParse(indi));
  });

  if (firstResult.success === false) {
    error.push(firstResult.error.formErrors.fieldErrors);
  } else {
    error.push({});
  }

  results.map((result: any) => {
    if (result.success === false) {
      error.push(result.error.formErrors.fieldErrors);
    } else {
      error.push({});
    }
  });

  let Errorval: boolean = false;
  for (const err of error) {
    if (Object.keys(err).length !== 0) {
      Errorval = true;
      break;
    }
  }
  if (Errorval) {
    return error;
  }

  const transformedData = results.map((item: any) => ({
    id: item.data.itemid,
  }));
  const resultsdata = results.map((data1: any) => data1.data);
  const creditValue = firstResult?.data.payment === "full" ? "full" : undefined;

  // Insert invoice into the database (Supabase)
  const { data: invoice, error: invoiceError } = await supabase
    .from("Invoices")
    .insert({
      paymentOption: firstResult.data.payment,
      credit: creditValue === "full" ? 0 : firstResult?.data?.total,
      customerid: firstResult.data.customerid,
      quantity: JSON.stringify(resultsdata),
      total: firstResult.data.total,
    })
    .select("*")
    .single();

  // Log the error if one exists
  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError);
    return; // Exit early if there's an error
  }

  // Check if invoice is null or undefined
  if (!invoice) {
    console.error("Invoice is null or undefined");
    // Exit early if invoice is null
  }

  // If invoice is created successfully, proceed with further logic
  console.log("Invoice created:", invoice);

  const invoiceId = invoice?.id; // Get the invoice id from the created invoice

  const invoiceItems = transformedData.map((item: any) => ({
    A: invoiceId, // The ID of the invoice
    B: item.id, // The ID of the item
  }));

  // Insert the relations into the "_InvoicesToItem" table
  const { data: invoiceItemsData, error: invoiceItemsError } = await supabase
    .from("_InvoicesToItem")
    .insert(invoiceItems);

  // Check for error while inserting invoice-items relationship
  if (invoiceItemsError) {
    console.error("Error linking invoice to items:", invoiceItemsError);
  } else {
    console.log("Invoice and items linked successfully:", invoiceItemsData);
  }

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError);
    return;
  }

  // Update item quantities (Supabase)
  const itemvalupdate = results.map(async (item1: any) => {
    const { data: currentItemData, error } = await supabase
      .from("Item")
      .select("qty")
      .eq("id", item1.data.itemid)
      .select("*")
      .single();
    console.log("CurrentItem", currentItemData);
    await supabase
      .from("Item")
      .update({
        qty: currentItemData?.qty - item1.data.qty, // Decrease quantity based on item.qty
      })
      .eq("id", item1.data.itemid);
  });
  console.log("First Result payment", firstResult?.data.payment);

  const { data: customer_details } = await supabase
    .from("Customer")
    .select("*")
    .eq("id", firstResult.data.customerid)
    .single();

  const creditUpdate = await supabase
    .from("Customer")
    .update({
      Credit:
        firstResult?.data.payment === "fullcredit"
          ? customer_details?.Credit + firstResult?.data.total
          : customer_details?.Credit,
    })
    .eq("id", firstResult.data.customerid);

  const paymentCreate =
    creditValue === "full"
      ? await supabase
          .from("Payments")
          .insert({
            amount: firstResult.data.total,
            invoiceid: invoiceId,
            customerid: firstResult.data.customerid,
            customername: firstResult.data.customerid,
            modeofpayment: firstResult?.data?.modeofpayment,
            paymentreason: `Invoice ${invoice?.id}`,
          })
          .select("*")
          .single() // You can use `.single()` to ensure only one row is inserted
      : null; // If condition is not met, return null

  // Check the result and log any errors
  if (paymentCreate && paymentCreate.error) {
    console.error("Error creating payment:", paymentCreate.error.message);
  } else {
    paymentCreate && console.log("Created Payment =>", paymentCreate.data);
  }
  // Revalidate the path to refresh the invoice data
  revalidatePath("/invoice");

  // Redirect to the invoice page
  redirect("/invoice");
}

// Update Invoice
export async function UpdateInvoice(invoice: string, arr: any, first: any) {
  const results: any = [];
  let firstResult: any;
  const error: any = [];
  const creditValue = firstResult?.data.payment === "full" ? "full" : undefined;
  firstResult = firstAddSchema.safeParse(first);
  arr.map((indi: any) => {
    results.push(itemAddSchema.safeParse(indi));
  });

  if (firstResult.success === false) {
    error.push(firstResult.error.formErrors.fieldErrors);
  }
  let Errorval: boolean = false;
  for (const err of error) {
    if (Object.keys(err).length !== 0) {
      Errorval = true;
      break;
    }
  }
  if (Errorval) {
    return error;
  }

  // Fetch the invoice data to get the old quantities and items
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("Invoices")
    .select("*")
    .eq("id", invoice)
    .single();

  if (invoiceError) {
    console.error("Error fetching invoice:", invoiceError);
    return;
  }
  console.log("Invoice Data", invoiceData);
  // Transformed data for the updated items
  const transformedData = results.map((item: any) => ({
    id: item.data?.itemid,
  }));

  // Remove old item associations (unlink old items from the invoice)
  // const { data: oldItems, error: oldItemsError } = await supabase
  //   .from("_InvoicesToItem")
  //   .select("*")
  //   .eq("A", invoice); // A is the invoice ID in the relationship table

  // if (oldItemsError) {
  //   console.error("Error fetching old item associations:", oldItemsError);
  //   return;
  // }

  // // If old item associations exist, remove them
  // if (oldItems && oldItems.length > 0) {
  //   const { error: deleteOldItemsError } = await supabase
  //     .from("_InvoicesToItem")
  //     .delete()
  //     .in(
  //       "id",
  //       oldItems.map((item: any) => item.id)
  //     );

  //   if (deleteOldItemsError) {
  //     console.error(
  //       "Error deleting old item associations:",
  //       deleteOldItemsError
  //     );
  //     return;
  //   }
  //   console.log("Old item associations removed.");
  // }

  // Insert new item associations (link the updated items to the invoice)
  const invoiceItems = transformedData.map((item: any) => ({
    A: invoice, // The ID of the invoice
    B: item.id, // The ID of the item
  }));

  const { data: invoiceItemsData, error: invoiceItemsError } = await supabase
    .from("_InvoicesToItem")
    .insert(invoiceItems);

  if (invoiceItemsError) {
    console.error("Error linking updated items to invoice:", invoiceItemsError);
    return;
  }
  console.log("New item associations added:", invoiceItemsData);

  // Now proceed with the quantity and credit updates (as previously discussed)

  // Fetch current quantities of items from previous invoice (to restore them)
  const currentQuantities = JSON.parse(invoiceData?.quantity || "[]");

  // First, restore the previous quantities (by adding back to the original stock)
  for (const oldItem of currentQuantities) {
    const { data: currentItemData, error: currentItemError } = await supabase
      .from("Item")
      .select("qty")
      .eq("id", oldItem.itemid)
      .single();

    if (currentItemError) {
      console.error("Error fetching current item data:", currentItemError);
      continue; // Skip to the next item if there's an error
    }

    const currentQty = currentItemData?.qty || 0;

    // Add back the old quantity to the current stock
    await supabase
      .from("Item")
      .update({
        qty: currentQty + oldItem.qty, // Add the old quantity back to the stock
      })
      .eq("id", oldItem.itemid);
  }
  const resultsdata = results.map((data1: any) => data1.data);
  // Subtract the new quantities for updated items

  console.log("Results", JSON.stringify(resultsdata));
  for (const newItem of results) {
    const { data: currentItemData, error: currentItemError } = await supabase
      .from("Item")
      .select("qty")
      .eq("id", newItem.data.itemid)
      .single();

    if (currentItemError) {
      console.error("Error fetching current item data:", currentItemError);
      continue; // Skip to the next item if there's an error
    }

    const currentQty = currentItemData?.qty || 0;
    const newQty = newItem.data.qty || 0;

    // Subtract the new quantity from the current stock
    await supabase
      .from("Item")
      .update({
        qty: currentQty - newQty, // Subtract the new quantity from the stock
      })
      .eq("id", newItem.data.itemid);
  }

  const { data: customerbef } = await supabase
    .from("Customer")
    .select("*")
    .eq("id", firstResult?.data?.customerid)
    .single();
  const creditChange = await supabase
    .from("Customer")
    .update({
      Credit: customerbef?.Credit - invoiceData?.total,
    })
    .eq("id", invoiceData?.customerid)
    .select("*");

  if (invoiceData?.paymentOption === "full") {
    const { data: deletedpayments, error: deletePaymentsError } = await supabase
      .from("Payments") // Specify the table name
      .delete()
      .eq("invoiceid", invoiceData?.id)
      .select("*")
      .single();

    if (deletePaymentsError) {
      console.log("Delete payments error=>", deletePaymentsError);
    }
    console.log("Deleted payments =>", deletedpayments);
  }
  // Update the invoice details (payment option, customer, total, etc.)
  const { data: updatedInvoice, error: updateInvoiceError } = await supabase
    .from("Invoices")
    .update({
      paymentOption: firstResult.data.payment,
      credit:
        firstResult?.data?.payment === "fullcredit"
          ? firstResult?.data?.total
          : 0,
      customerid: firstResult.data.customerid,

      quantity: JSON.stringify(resultsdata),
      total: firstResult.data.total,
    })
    .eq("id", invoice)
    .select("*")
    .single();

  if (updateInvoiceError) {
    console.error("Error updating invoice:", updateInvoiceError);
    return;
  }
  const { data: customerdet } = await supabase
    .from("Customer")
    .select("*")
    .eq("id", firstResult?.data?.customerid)
    .single();
  // Update the customer's credit based on the payment method
  const creditUpdate =
    firstResult?.data?.payment === "fullcredit"
      ? await supabase
          .from("Customer")
          .update({
            Credit: customerdet?.Credit + firstResult.data.total,
          })
          .eq("id", firstResult.data.customerid)
      : "";
  // await supabase
  //     .from("Customer")
  //     .update({
  //       Credit: firstResult.data.total,
  //     })
  //     .eq("id", firstResult.data.customerid);

  if (creditValue === "full") {
    const { data: paymentCreate, error: paymentCreateError } = await supabase
      .from("Payments")
      .insert({
        amount: firstResult.data.total,
        invoiceid: invoiceData?.id,
        customerid: firstResult.data.customerid,
        modeofpayment: firstResult?.data?.modeofpayment,
        paymentreason: `Invoice ${invoiceData?.id}`,
      })
      .select("*")
      .single(); // You can use `.single()` to ensure only one row is inserted
    // If condition is not met, return null

    // Check the result and log any errors
    if (paymentCreateError) {
      console.error("Error creating payment:", paymentCreateError.message);
    } else {
      console.log("Created Payment =>", paymentCreate);
    }
  }
  console.log("Updated Invoice:", updatedInvoice);

  // Revalidate the path to refresh the invoice data
  revalidatePath("/invoice");

  // Redirect to the invoice page
  redirect("/invoice");
}

// Delete Invoice
export async function DeleteInvoice(invoice: string) {
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("Invoices")
    .select("*")
    .eq("id", invoice)
    .single();

  if (invoiceError) {
    console.error("Error fetching invoice:", invoiceError);
    return;
  }

  const quan1 = JSON.parse(invoiceData?.quantity || "[]");
  const itemUpdatePromises = quan1.map(async (quantity: any) => {
    const { data: currentItemData, error } = await supabase
      .from("Item")
      .select("qty")
      .eq("id", quantity?.itemid)
      .select("*")
      .single();
    console.log("CurrentItem", currentItemData);
    await supabase
      .from("Item")
      .update({
        qty: currentItemData?.qty + quantity.qty, // Increase item qty based on quantity in invoice
      })
      .eq("id", quantity?.itemid);
  });

  await Promise.all(itemUpdatePromises);

  const { data: deletedInvoice, error: deleteInvoiceError } = await supabase
    .from("Invoices")
    .delete()
    .eq("id", invoice)
    .select("*")
    .single();

  if (deleteInvoiceError) {
    console.error("Error deleting invoice:", deleteInvoiceError);
    return;
  }
  console.log("Deleted Invoice", deletedInvoice);
  const { data: customer } = await supabase
    .from("Customer")
    .select("*")
    .eq("id", deletedInvoice?.customerid)
    .single();
  const creditUpdate =
    deletedInvoice?.paymentOption === "fullcredit"
      ? await supabase
          .from("Customer")
          .update({
            Credit: customer?.Credit - deletedInvoice?.total, // Decrease credit on deletion
          })
          .eq("id", deletedInvoice?.customerid)
      : "";

  const { data: paymentUpdate, error: paymentUpdateError } = await supabase
    .from("Payments")
    .update({
      customerid: null,
      invoiceid: null,
    })
    .eq("invoiceid", deletedInvoice?.id);

  console.log("Deleted Invoice:", deletedInvoice);

  // Revalidate the path to refresh the invoice data
  revalidatePath("/invoice");

  // Redirect to the invoice page
  redirect("/invoice");
}
