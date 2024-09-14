"use client";

import { LoginForm } from "./LoginForm";
export const runtime = "edge";

export default async function Login() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
