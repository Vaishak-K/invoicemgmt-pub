"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const [error, action] = useFormState(login, {});

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-900">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 max-w-lg">
        <h1 className="text-sm top-8 pb-4">
          To Enter use the Credentials given below:
        </h1>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome
        </h2>

        <form action={action} className="flex flex-col gap-6">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition ease-in-out"
            />
          </div>
          {error?.email && (
            <p className="text-red-500 text-sm mt-1">{error?.email}</p>
          )}
          Email:billing123@gmail.com
          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition ease-in-out"
            />
          </div>
          {error?.password && (
            <p className="text-red-500 text-sm mt-1">{error?.password}</p>
          )}
          Password:12345678
          {/* Forgot Password Section */}
          <div className="flex justify-between items-center">
            <h1
              onClick={() =>
                alert(
                  "OoPS! This is UNDER Work!🚧🚧 Please use the available login option!👷🏼👷🏼‍♀️"
                )
              }
              className="text-sm text-teal-600 hover:text-teal-700 cursor-pointer transition ease-in-out"
            >
              Forgot Password?
            </h1>
          </div>
          {/* Submit Button */}
          <SubmitButton />
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <span
              onClick={() =>
                alert(
                  "OoPS! This is UNDER Work!🚧🚧 Please use the available login option!👷🏼👷🏼‍♀️"
                )
              }
              className="text-teal-600 hover:text-teal-700 cursor-pointer transition ease-in-out"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300 ease-in-out shadow-md rounded-lg py-3"
    >
      {pending ? "Logging In..." : "Login"}
    </Button>
  );
}
