"use client";

import React, { useTransition } from "react";

import { useRouter } from "next/navigation";

import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { DeleteChallan } from "@/app/actions/deliverychallan";

function DeleteDelChallan({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  console.log(`Delete Payment for ${id} is Executing`);
  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive"
      onClick={() => {
        startTransition(async () => {
          await DeleteChallan(id);
          router.refresh();
        });
      }}
    >
      Delete Challan
    </DropdownMenuItem>
  );
}
export default DeleteDelChallan;
