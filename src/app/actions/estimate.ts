"use server";
import { object, z } from "zod";
import { supabase } from "@/lib/supabase";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

//Invoice Adding Function
// export const runtime = "edge";

export async function AddEstimate(arr: any, first: any) {
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
  console.log("Error:", error);
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

  let a: any;

  const transformedData = results.map((item: any) => ({
    id: item.data.itemid,
  }));
  const resultsdata = results.map((data1: any) => data1.data);
  const creditValue = firstResult?.data.payment === "full" ? "full" : undefined;
  const { data: estimateData, error: estimateError } = await supabase
    .from("Estimates") // The Estimates table
    .insert([
      {
        customerid: firstResult.data.customerid, // Connect the customer by ID
        total: firstResult.data.total,
        quantity: JSON.stringify(resultsdata),
      },
    ])
    .select("*")
    .single(); // Use `.single()` if you want to get only one result

  if (estimateError) {
    console.error("Error creating estimate:", estimateError.message);
    return;
  }

  // Assuming `transformedData` is an array of item objects
  const estimateId = estimateData?.id;

  // Insert the relations into _EstimatesToItem join table
  const estimateItemRelations = transformedData.map((item: any) => ({
    A: estimateId, // The estimate ID
    B: item.id, // The item ID
  }));

  // Insert into the join table to associate items with the estimate
  const { data: estimateItemsData, error: estimateItemsError } = await supabase
    .from("_EstimatesToItem")
    .insert(estimateItemRelations);

  if (estimateItemsError) {
    console.error(
      "Error linking items to estimate:",
      estimateItemsError.message
    );
    return;
  }

  console.log("Estimate created and items linked successfully:", estimateData);

  revalidatePath("/estimate");

  // Redirect to the invoice page
  redirect("/estimate");
}
//Update Invoice

export async function UpdateEstimate(estimate: string, arr: any, first: any) {
  const results: any = [];
  let firstResult: any;
  const error: any = [];
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

  results.map((result: any) => {
    if (result.success === false) {
      error.push(result.error.formErrors.fieldErrors);
    } else {
      error.push({});
    }
  });
  // Fetch the estimate and its associated quantity (if any)
  const { data: estimateData, error: estimateError } = await supabase
    .from("Estimates")
    .select("quantity")
    .eq("id", estimate)
    .single();

  if (estimateError) {
    console.error("Error fetching estimate:", estimateError.message);
    return;
  }

  // Parse the current quantity if it exists
  let quan1: any = [];
  if (estimateData?.quantity) {
    quan1 = JSON.parse(estimateData?.quantity);
  }

  // Transform the incoming data (items)
  const transformedData = results.map((item: any) => ({
    id: item.data?.itemid,
  }));

  const resultsdata = results.map((data1: any) => data1.data);

  // Update the Estimate with new quantity and total
  const { data: updatedEstimate, error: updateEstimateError } = await supabase
    .from("Estimates")
    .update({
      quantity: JSON.stringify(resultsdata),
      total: firstResult.data.total,
    })
    .eq("id", estimate)
    .single(); // .single() to return only one row

  if (updateEstimateError) {
    console.error("Error updating estimate:", updateEstimateError.message);
    return;
  }

  console.log("Updated Estimate =>", updatedEstimate);

  // Revalidate the path to refresh the estimate data
  revalidatePath("/estimate");

  // Redirect to the estimate page
  redirect("/estimate");
}

//Delete

export async function DeleteEstimate(estimate: string) {
  // const quan = await prisma.estimates.findUnique({
  //   where: { id: estimate },
  // });
  const { data, error } = await supabase
    .from("Estimates") // Specify the table name
    .delete() // Use delete() to delete a record
    .eq("id", estimate); // Filter by the `id` of the estimate

  // Error handling
  if (error) {
    console.error("Error deleting estimate:", error.message);
    return;
  }

  console.log("Deleted Estimate:", data);
  revalidatePath("/estimate");
  redirect("/estimate");
}
