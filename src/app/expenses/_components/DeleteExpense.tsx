"use client";

import React, { useTransition } from "react";
import { deleteExpense } from "@/app/actions/expenses";

import { useRouter } from "next/navigation";
import Modal from "@/app/invoice/_components/Modal";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

function DeleteExpense({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  console.log(`Delete Customer for ${id} is Executing`);
  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive"
      onClick={() => {
        startTransition(async () => {
          await deleteExpense(id);
          router.refresh();
        });
      }}
    >
      Delete Page
    </DropdownMenuItem>
  );
}
export default DeleteExpense;
