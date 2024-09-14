"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// export const runtime = "edge";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const { email, password } = result.data;

  if (
    email !== process.env.EMAIL ||
    !(await isValidPassword(password, String(process.env.HASHED_PASSWORD)))
  ) {
    return {
      email: ["Invalid email or password"],
    };
  }

  await createSession(String(process.env.ID));

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  return (await hashPassword(password)) === hashedPassword;
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  return Buffer.from(arrayBuffer).toString("base64");
}
