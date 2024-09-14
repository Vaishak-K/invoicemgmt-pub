"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export const runtime = "edge";

const numberOrNaN = z
  .union([
    z.string().transform((val) => {
      const coercedValue = Number(val);
      return isNaN(coercedValue) ? NaN : coercedValue;
    }),
    z.number(),
  ])
  .refine(
    (val) =>
      typeof val === "number" && (Number.isNaN(val) || !Number.isNaN(val)),
    {
      message: "Value must be a number or NaN",
    }
  );

const addSchema = z.object({
  amount: z.coerce.number().refine((value) => !isNaN(value), {
    message: "Amount must be a valid number.",
  }),

  customerid: z.string().min(1),
  invoiceid: z.string().min(1).optional(),
  customername: z.string().min(1, { message: "Name is required." }).optional(),
  paymentreason: z
    .string()
    .min(1, { message: "Reason is required." })
    .optional(),
  modeofpayment: z.string().min(1, { message: "Mode of Payment is required." }),
});

export async function addPayment(prevState: unknown, formData: FormData) {
  const abc = formData.get("customerid");
  const customerdata =
    abc !== "Others"
      ? await supabase
          .from("Customer")
          .select("id, name")
          .eq("id", abc)
          .single()
      : undefined;

  let reason = formData.get("invoiceid");
  !formData.get("paymentreason")
    ? formData.append("paymentreason", `Invoice:${reason}`)
    : "";
  !formData.get("customername")
    ? formData.append("customername", customerdata?.data?.name || "")
    : "";

  const obj = Object.fromEntries(formData.entries());
  const result = addSchema.safeParse(obj);
  console.log("Results data pauyents", result?.data);
  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  console.log("Data invoice:", typeof data?.invoiceid);
  // Insert the payment record
  const { data: dbdata, error: dbError } =
    data?.invoiceid != "null"
      ? await supabase
          .from("Payments")
          .insert({
            paymentreason: data.paymentreason,
            customername: data.customername,
            amount: data.amount,
            modeofpayment: data.modeofpayment,
            customerid: data.customerid || null,
            invoiceid: data.invoiceid || null, // Only include invoiceid if it exists
          })
          .select("*")
          .single()
      : await supabase
          .from("Payments")
          .insert({
            paymentreason: data.paymentreason,
            customername: data.customername,
            amount: data.amount,
            modeofpayment: data.modeofpayment,
            customerid: data.customerid || null,
            // Only include invoiceid if it exists
          })
          .select("*")
          .single();

  // const {data:customer_details}=await supabase.from("Customer").select("*").eq("id",dbdata?.customerid)

  // if(dbdata?.invoiceid){

  // }
  if (dbError) {
    console.log("Error adding payment:", dbError);
  }

  // Fetch the current customer and invoice values
  let customerCredit = 0;
  let invoiceCredit = 0;

  if (dbdata?.customerid) {
    const { data: customerData, error: customerError } = await supabase
      .from("Customer")
      .select("Credit")
      .eq("id", dbdata?.customerid)
      .single();

    if (customerError || !customerData) {
      console.error("Error fetching customer data:", customerError);
      return null;
    }

    customerCredit = customerData.Credit;
  }

  if (dbdata?.invoiceid) {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("Invoices")
      .select("credit")
      .eq("id", dbdata?.invoiceid)
      .single();

    if (invoiceError || !invoiceData) {
      console.error("Error fetching invoice data:", invoiceError);
      return null;
    }

    invoiceCredit = invoiceData.credit;
  }

  // Update customer credit
  if (dbdata?.customerid) {
    const { error: customerUpdateError } = await supabase
      .from("Customer")
      .update({
        Credit: customerCredit - data.amount, // Subtract payment amount from current Credit value
      })
      .eq("id", dbdata?.customerid)
      .select("*");

    if (customerUpdateError) {
      console.error("Error updating customer credit:", customerUpdateError);
    }
  }

  // Update invoice credit
  if (dbdata?.invoiceid) {
    const { error: invoiceUpdateError } = await supabase
      .from("Invoices")
      .update({
        credit: invoiceCredit - data.amount, // Subtract payment amount from current credit value
      })
      .eq("id", dbdata?.invoiceid)
      .select("*");

    if (invoiceUpdateError) {
      console.error("Error updating invoice credit:", invoiceUpdateError);
      return null;
    }
  }

  revalidatePath("/payments");
  redirect("/payments");
}

export async function updatePayment(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());
  const result = addSchema.safeParse(obj);

  if (!result.success) {
    console.error(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // Fetch the current payment record and related customer and invoice info
  const { data: fetchPayment, error: fetchError } = await supabase
    .from("Payments")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching payment:", fetchError);
    return null;
  }
  console.log("Payment inide Update:", fetchPayment);
  // Fetch the current customer and invoice values
  let customerCredit = 0;
  let invoiceCredit = 0;

  if (fetchPayment?.customerid) {
    const { data: customerData, error: customerError } = await supabase
      .from("Customer")
      .select("*")
      .eq("id", fetchPayment.customerid)
      .single();
    console.log("Customer Data:", customerData);
    if (customerError || !customerData) {
      console.error("Error fetching customer data:", customerError);
      return null;
    }
    // console.log("Customer Data:", customerData?.Credit);
    customerCredit = customerData.Credit;
    // console.log("Customer Credit inside if block", customerCredit);
  }
  // console.log("Customer Credit outside if block", customerCredit);
  if (fetchPayment?.invoiceid) {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("Invoices")
      .select("*")
      .eq("id", fetchPayment.invoiceid)
      .single();
    console.log("Invoice Data:", invoiceData);
    if (invoiceError || !invoiceData) {
      console.error("Error fetching invoice data:", invoiceError);
      return null;
    }

    invoiceCredit = invoiceData.credit;
    // console.log("Invoice Credit inside if Block", invoiceCredit);
  }
  // console.log("Invoice Credit outside if Block", invoiceCredit);
  // Revert any changes to customer and invoice credit
  if (fetchPayment?.customerid) {
    const { data } = await supabase
      .from("Customer")
      .update({
        Credit: customerCredit + fetchPayment.amount, // Add back the previous payment amount
      })
      .eq("id", fetchPayment.customerid)
      .select("*")
      .single();
    console.log("Restored Customer Value:", data);
    customerCredit = data?.Credit;
  }

  if (fetchPayment?.invoiceid) {
    const { data } = await supabase
      .from("Invoices")
      .update({
        credit: invoiceCredit + fetchPayment.amount, // Add back the previous payment amount
      })
      .eq("id", fetchPayment.invoiceid)
      .select("*")
      .single();
    console.log("Restored Invoice Value:", data);
    invoiceCredit = data?.credit;
  }

  // Update the payment record with the new data
  const { data: dbdata, error: dbError } =
    data?.invoiceid != "null"
      ? await supabase
          .from("Payments")
          .update({
            paymentreason: data.paymentreason,
            customername: data.customername,
            amount: data.amount,
            modeofpayment: data.modeofpayment,
            customerid: data.customerid || null,
            invoiceid: data.invoiceid || null,
          })
          .eq("id", id)
          .select("*")
          .single()
      : await supabase
          .from("Payments")
          .update({
            paymentreason: data.paymentreason,
            customername: data.customername,
            amount: data.amount,
            modeofpayment: data.modeofpayment,
            customerid: data.customerid || null,
          })
          .eq("id", id)
          .select("*")
          .single();

  if (dbError) {
    console.log("Error updating payment:", dbError);
  }

  // Update customer and invoice credits with the new payment amount
  if (dbdata?.customerid) {
    const { data: updateCustomer, error: customerUpdateError } = await supabase
      .from("Customer")
      .update({
        Credit: customerCredit - data.amount, // Subtract the new payment amount
      })
      .eq("id", dbdata?.customerid)
      .select("*");
    console.log("Updated CUstomer", updateCustomer);
    if (customerUpdateError) {
      console.error("Error updating customer credit:", customerUpdateError);
      return null;
    }
  }

  if (dbdata?.invoiceid) {
    const { data: updateInvoice, error: invoiceUpdateError } = await supabase
      .from("Invoices")
      .update({
        credit: invoiceCredit - data.amount, // Subtract the new payment amount
      })
      .eq("id", dbdata?.invoiceid)
      .select("*");
    console.log("Updated Invoice", updateInvoice);
    if (invoiceUpdateError) {
      console.error("Error updating invoice credit:", invoiceUpdateError);
      return null;
    }
  }
  console.log("Payment Update=>", dbdata);
  revalidatePath("/payments");
  redirect("/payments");
}

export async function deletePayment(id: string) {
  console.log(`Deleting ID: ${id}`);

  // Fetch the payment to get related customer and invoice info
  const { data: dbdelete, error: dbError } = await supabase
    .from("Payments")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError) {
    console.error("Error fetching payment for deletion:", dbError);
    return "Error";
  }

  // Delete the payment record
  const { error: deleteError } = await supabase
    .from("Payments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting payment:", deleteError);
    return "Error";
  }

  // Fetch the current customer and invoice values
  let customerCredit = 0;
  let invoiceCredit = 0;

  if (dbdelete?.customerid) {
    const { data: customerData, error: customerError } = await supabase
      .from("Customer")
      .select("Credit")
      .eq("id", dbdelete.customerid)
      .single();

    if (customerError || !customerData) {
      console.error("Error fetching customer data:", customerError);
      return null;
    }

    customerCredit = customerData.Credit;
  }

  if (dbdelete?.invoiceid) {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("Invoices")
      .select("credit")
      .eq("id", dbdelete.invoiceid)
      .single();

    if (invoiceError || !invoiceData) {
      console.error("Error fetching invoice data:", invoiceError);
      return null;
    }

    invoiceCredit = invoiceData.credit;
  }

  // Revert the customer and invoice credits to include the deleted payment amount
  if (dbdelete?.customerid) {
    const { error: customerUpdateError } = await supabase
      .from("Customer")
      .update({
        Credit: customerCredit + dbdelete.amount, // Add back the deleted payment amount
      })
      .eq("id", dbdelete.customerid);

    if (customerUpdateError) {
      console.error("Error updating customer credit:", customerUpdateError);
      return null;
    }
  }

  if (dbdelete?.invoiceid) {
    const { error: invoiceUpdateError } = await supabase
      .from("Invoices")
      .update({
        credit: invoiceCredit + dbdelete.amount, // Add back the deleted payment amount
      })
      .eq("id", dbdelete.invoiceid);

    if (invoiceUpdateError) {
      console.error("Error updating invoice credit:", invoiceUpdateError);
      return null;
    }
  }

  console.log("Deleted Payment:", dbdelete);
  revalidatePath("/payments");
  redirect("/payments");
}
