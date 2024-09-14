import React, { ReactNode } from "react";

export default function PageHeader({ message }: { message: string }) {
  return (
    <div className="bg-teal-600 text-white p-6">
      <h1 className="text-4xl font-extrabold text-center tracking-tight">
        {message}
      </h1>
    </div>
  );
}
