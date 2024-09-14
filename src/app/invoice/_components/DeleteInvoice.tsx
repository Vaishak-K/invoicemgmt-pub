"use client";

import React, { useTransition } from "react";
import { DeleteInvoice } from "@/app/actions/invoice";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

function Deleteinvoice1({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      defaultChecked={true}
      className="bg-destructive cursor-pointer"
      onClick={() => {
        startTransition(async () => {
          await DeleteInvoice(id);
          router.refresh();
        });
      }}
    >
      Delete Invoice
    </DropdownMenuItem>
  );
}
export default Deleteinvoice1;
