"use client";

import React, { useTransition } from "react";
import { DeleteInvoice } from "@/app/actions/invoice";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DeleteEstimate } from "@/app/actions/estimate";

function DeleteEstimate1({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive cursor-pointer"
      onClick={() => {
        startTransition(async () => {
          await DeleteEstimate(id);
          router.refresh();
        });
      }}
    >
      Delete Estimate
    </DropdownMenuItem>
  );
}
export default DeleteEstimate1;
