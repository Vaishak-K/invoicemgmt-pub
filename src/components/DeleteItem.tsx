"use client";

import React, { useTransition } from "react";

import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteItem } from "@/app/actions/item";

function DeleteItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  console.log(`Delete Customer for ${id} is Executing`);
  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive"
      onClick={async () => {
        await deleteItem(id);
        router.refresh();
      }}
    >
      Delete Page
    </DropdownMenuItem>
  );
}
export default DeleteItem;
