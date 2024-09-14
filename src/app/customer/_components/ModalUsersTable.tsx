"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import FunctionalModal from "@/app/customer/_components/FunctionModal"; // Keep the name as is
import { ExtractCustomerData } from "@/components/ExtractCustomerData";
import * as XLSX from "xlsx";

function ModalUsersTable() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const exportToXLSX = async () => {
    // Convert data to worksheet
    const customer_details: any = await ExtractCustomerData();

    const worksheet = XLSX.utils.json_to_sheet(customer_details);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to a file
    XLSX.writeFile(workbook, `workbook1.xlsx`);
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="text-teal-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              onClick={openModal}
              className="bg-teal-500 text-white hover:bg-teal-600 transition duration-200"
            >
              Import Customer Values
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={exportToXLSX}
              className="py-2 px-6 rounded max-w-52 bg-red-500/90 text-slate-100 "
            >
              Export Data
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      <FunctionalModal show={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default ModalUsersTable;
