"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// export const runtime = "edge";

const addSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  address: z.string().min(1),
  phone: z.coerce
    .number()
    .int({ message: "Phone number must be an integer." })
    .min(1000000000, { message: "Phone number must be at least 10 digits." }),
  gst: z
    .string()
    .min(15, { message: "GST number must be exactly 15 characters long." }) // Custom message for min length
    .max(15, { message: "GST number must be exactly 15 characters long." }), // Custom message for max length
  email: z
    .string()
    .email({ message: "Invalid email format." }) // Custom message for invalid email
    .min(1, { message: "Email is required." }), // Custom message for min length,
});

export async function addCustomer(
  prevState: unknown,
  formData: FormData,
  customer1?: any
) {
  const obj = Object.fromEntries(formData.entries());
  console.log("Raw Object:", obj);
  const result = addSchema.safeParse(obj);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  console.log("Result Customer Data:", data);
  const {
    data: dbdata,
    error,
    count,
  } = await supabase
    .from("Customer")
    .insert([
      {
        name: data.name,
        address: data.address,
        GST: data.gst,
        phone: data.phone,
        Email: data.email,
        Credit: 0,
      },
    ])
    .select();
  console.log("error", error);
  console.log("dbddata", dbdata);
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/customer");
}

export async function updateCustomer(
  id: number,
  prevState: unknown,
  formData: FormData,
  customer1?: any
) {
  const obj = Object.fromEntries(formData.entries());
  const result = addSchema.safeParse(obj);
  if (result.success === false) return result.error.formErrors.fieldErrors;
  const data = result.data;
  const { data: dbupdate, error } = await supabase
    .from("Customer") // 'customer' is the table name in Supabase
    .update({
      name: data.name,
      address: data.address,
      GST: data.gst,
      phone: data.phone,
      Email: data.email,
    })
    .eq("id", id) // Match by the 'id' column
    .single(); // Ensure that we get a single row, as only one row is updated
  console.log(dbupdate);
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/customer");
}

export async function deleteCustomer(id: string) {
  const { data, error } = await supabase
    .from("Customer") // Table name
    .delete()
    .eq("id", id); // Filtering by id

  if (error) {
    console.error("Error deleting customer:", error.message);
  } else {
    console.log("Customer deleted successfully", data);
  }
  revalidatePath("/customer");
  revalidatePath("/");
  redirect("/customer");
}

export async function AddCustomerValue(customer1: any) {
  // const obj = Object.fromEntries(formData.entries());
  // console.log("Raw Object:", obj);

  const { data: finder, error } = await supabase
    .from("Customer")
    .select("*")
    .eq("phone", customer1?.phone)
    .single();
  if (finder == null) {
    const result = addSchema.safeParse(customer1);
    if (result.success === false) {
      console.log("False");
      console.log(result.error.formErrors.fieldErrors);
      return result.error.formErrors.fieldErrors;
    }
    const data = result.data;
    console.log("Result Customer Data:", data);
    try {
      const { data: dbdata, error } = await supabase
        .from("Customer")
        .insert([
          {
            name: data.name,
            address: data.address,
            GST: data.gst,
            phone: data.phone,
            Email: data.email,
            Credit: 0,
          },
        ])
        .select("*")
        .single();
      if (error) {
        console.log("Error Saving Data", error);
      }
      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  }
  revalidatePath("/customer");
  redirect("/customer");
}

export async function UpdateCustomerValue(customer1: any) {
  // const obj = Object.fromEntries(formData.entries());
  // console.log("UpdateCustomer");
  // console.log("Raw Object:", customer1);
  const { data: finder, error } = await supabase
    .from("Customer")
    .select("*")
    .eq("phone", customer1?.phone)
    .single(); // Ensures you get a single result

  // console.log("Finder:", finder);
  const result = addSchema.safeParse(customer1);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  if (finder === null) {
    try {
      const { data: dbdata, error } = await supabase
        .from("Customer")
        .insert([
          {
            name: data.name,
            address: data.address,
            GST: data.gst,
            phone: data.phone,
            Email: data.email,
            Credit: 0,
          },
        ])
        .single();

      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  } else {
    try {
      const { data: dbdata, error } = await supabase
        .from("Customer")
        .update({
          name: data.name,
          address: data.address,
          GST: data.gst,
          phone: data.phone,
          Email: data.email,
        })
        .eq("phone", BigInt(customer1?.phone)); // Updates the row where the phone matches

      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  }
  revalidatePath("/customer");
  redirect("/customer");
}

export async function JustAddCustomerValue(customer1: any) {
  // const obj = Object.fromEntries(formData.entries());
  // console.log("JustAdd");
  // console.log("Raw Object:", customer1?.phone);
  const { data: finder, error } = await supabase
    .from("Customer")
    .select("*")
    .eq("phone", customer1?.phone)
    .single(); // Fetches a single row, similar to findUnique

  console.log("Finder:", finder);
  const result = addSchema.safeParse(customer1);
  if (result.success === false) {
    console.log("False");
    console.log(result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  // console.log("Result Customer Data:", data);
  if (finder === null) {
    try {
      const { data: dbdata, error } = await supabase.from("customer").insert([
        {
          name: data.name,
          address: data.address,
          GST: data.gst,
          phone: data.phone,
          Email: data.email,
          Credit: 0,
        },
      ]);

      console.log(dbdata);
    } catch (err) {
      console.error(err);
    }
  }
  revalidatePath("/customer");
  redirect("/customer");
}
