"use client";

import React, { useTransition } from "react";

import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { deletePayment } from "@/app/actions/payments";

function DeletePayment({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  console.log(`Delete Payment for ${id} is Executing`);
  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive"
      onClick={() => {
        startTransition(async () => {
          await deletePayment(id);
          router.refresh();
        });
      }}
    >
      Delete Payment
    </DropdownMenuItem>
  );
}
export default DeletePayment;
