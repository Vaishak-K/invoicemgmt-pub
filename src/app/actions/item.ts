"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// export const runtime = "edge";

const addSchema = z.object({
  itemid: z.string().min(1, { message: "Item name is required" }).optional(),
  itemname: z.string().min(1, { message: "Item name is required" }),
  price: z.coerce
    .number()
    .int()
    .min(1, { message: "Price must be a positive integer" }),
  qty: z.coerce
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" }),
  tax: z.coerce
    .number()
    .int()
    .min(0, { message: "Tax must be a non-negative integer" }), // Allowing tax to be zero
});

export async function addItem(prevState: unknown, formData: FormData) {
  const obj = Object.fromEntries(formData.entries());

  const result = addSchema.safeParse(obj);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log(data);

  // Using Supabase to add the item to the database
  const { data: dbdata, error } = await supabase.from("Item").insert([
    {
      itemname: data.itemname,
      price: data.price,
      qty: data.qty,
      tax: data.tax,
    },
  ]);

  if (error) {
    console.error("Error inserting item:", error.message);
  }

  revalidatePath("/items");
  redirect("/items");
}

export async function updateItem(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const obj = Object.fromEntries(formData.entries());
  const result = addSchema.safeParse(obj);
  if (result.success === false) return result.error.formErrors.fieldErrors;
  const data = result.data;

  // Using Supabase to update the item in the database
  const { data: dbupdate, error } = await supabase
    .from("Item")
    .update({
      itemname: data.itemname,
      price: data.price,
      qty: data.qty,
      tax: data.tax,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating item:", error.message);
  }

  console.log(dbupdate);
  revalidatePath("/items");
  redirect("/items");
}

export async function deleteItem(id: string) {
  // Using Supabase to delete the item
  const { data: dbdelete, error } = await supabase
    .from("Item")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error.message);
    return "Error";
  }

  console.log(dbdelete);
  revalidatePath("/items");
  redirect("/items");
}

export async function UpdateItemValue(item1: any) {
  console.log("Raw Object:", item1);

  // Using Supabase to find the item based on itemid
  const { data: finder, error: findError } = await supabase
    .from("Item")
    .select("*")
    .eq("itemid", item1?.itemid)
    .single();

  if (findError) {
    console.error("Error finding item:", findError.message);
  }

  console.log("Finder:", finder);
  const result = addSchema.safeParse(item1);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log("Result Customer Data:", data);

  if (!finder) {
    try {
      // Using Supabase to insert the item if it doesn't exist
      const { data: dbdata, error } = await supabase.from("Item").insert([
        {
          itemid: data?.itemid,
          itemname: data.itemname,
          price: data.price,
          qty: data.qty,
          tax: data.tax,
        },
      ]);

      if (error) {
        console.error("Error inserting item:", error.message);
        return error.message;
      }
      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      // Using Supabase to update the item if it exists
      const { data: dbdata, error } = await supabase
        .from("Item")
        .update({
          itemid: data?.itemid,
          itemname: data.itemname,
          price: data.price,
          qty: data.qty,
          tax: data.tax,
        })
        .eq("id", finder.id);

      if (error) {
        console.error("Error updating item:", error.message);
        return error.message;
      }
      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  }

  revalidatePath("/items");
  redirect("/items");
}

export async function JustAddItemValue(item1: any) {
  const { data: finder, error: findError } = await supabase
    .from("Item")
    .select("*")
    .eq("itemid", item1?.itemid)
    .single();

  if (findError) {
    console.error("Error finding item:", findError.message);
  }

  console.log("Finder:", finder);
  const result = addSchema.safeParse(item1);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log("Result Customer Data:", data);

  if (!finder) {
    try {
      // Using Supabase to insert the item if it doesn't exist
      const { data: dbdata, error } = await supabase.from("Item").insert([
        {
          itemid: data?.itemid,
          itemname: data.itemname,
          price: data.price,
          qty: data.qty,
          tax: data.tax,
        },
      ]);

      if (error) {
        console.error("Error inserting item:", error.message);
        return error.message;
      }
      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  }

  revalidatePath("/items");
  redirect("/items");
}
