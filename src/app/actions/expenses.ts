"use server";

import { z } from "zod";
import { supabase } from "../../lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// export const runtime = "edge";

const addSchema = z.object({
  empname: z.string().min(1, { message: "Name is required." }),
  reason: z.string().min(1, { message: "Reason is required." }),
  amount: z.coerce
    .number()
    .int()
    .min(1, { message: "Price must be more than 0." }),
  isTaxable: z.coerce.string(),
  taxValue: z.coerce
    .number()
    .int({ message: "Tax must be an integer." })
    .min(0, { message: "Tax Value must be greater than 0" })
    .optional(), // Custom message for max length
});

export async function addExpense(prevState: unknown, formData: FormData) {
  const obj = Object.fromEntries(formData.entries());
  console.log("Object", obj);
  const result = addSchema.safeParse(obj);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log("Result Expense Data:", data);

  // Insert expense into Supabase table
  const { data: dbdata, error } = await supabase
    .from("Expenses")
    .insert({
      empname: data.empname,
      reason: data.reason,
      amount: data.amount,
      isTaxable:
        data.isTaxable === "undefined" ? false : Boolean(data.isTaxable),
      taxValue: data.taxValue || 0,
      finalPrice: data.amount + (data.amount * (data.taxValue || 0)) / 100,
    })
    .single(); // .single() ensures we get the inserted row's data back

  if (error) {
    console.log("Error inserting expense:", error);
    return;
  }

  console.log("Inserted Data:", dbdata);
  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpense(id: any) {
  console.log(`Deleting ID: ${id}`);

  // Delete expense from Supabase table
  const { data: dbdelete, error } = await supabase
    .from("Expenses")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.log("Error deleting expense:", error);
    return "Error";
  }

  console.log("Deleted Details", dbdelete);
  revalidatePath("/expenses");
  redirect("/expenses");
}
export async function updateExpense(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());
  console.log("Object", obj);
  const result = addSchema.safeParse(obj);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log("Result Expense Data:", data);

  // Update expense in Supabase table
  const { data: dbdata, error } = await supabase
    .from("Expenses")
    .update({
      empname: data.empname,
      reason: data.reason,
      amount: data.amount,
      isTaxable:
        data.isTaxable === "undefined" ? false : Boolean(data.isTaxable),
      taxValue: data.taxValue || 0,
      finalPrice: data.amount + (data.amount * (data.taxValue || 0)) / 100,
    })
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error updating expense:", error);
    return;
  }

  console.log("Updated Data:", dbdata);
  revalidatePath("/expenses");
  redirect("/expenses");
}
