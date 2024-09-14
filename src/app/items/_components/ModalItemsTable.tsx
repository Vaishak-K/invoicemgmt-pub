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
import * as XLSX from "xlsx";
import ImportItemsModal from "./ImportItemsModal";
import { ExtractItemsData } from "@/components/ExtractCustomerData";

function ModalItemsTable() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const exportToXLSX = async (): Promise<void> => {
    // Convert data to worksheet
    const customerDetails: Array<Record<string, any>> =
      await ExtractItemsData();

    // Ensure that data exists before proceeding
    if (!customerDetails || customerDetails.length === 0) {
      console.error("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(customerDetails);

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
              className=" hover:text-white hover:bg-teal-600 transition duration-200"
            >
              Import Items
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={exportToXLSX}
              className="py-2 px-6 rounded bg-red-500/90 text-slate-100 "
            >
              Export Data
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportItemsModal show={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default ModalItemsTable;
