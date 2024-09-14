"use client";

import React, { useState, useTransition } from "react";
import { deleteCustomer } from "@/app/actions/customer";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Modal from "@/app/invoice/_components/Modal";
import ErrorModal from "./ErrorModal";

function DeleteCust({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<any>();
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const router = useRouter();
  console.log(`Delete Customer for ${id} is Executing`);
  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCustomer(id); // Your async action
        router.refresh(); // Refresh after success
      } catch (err) {
        setError(err); // Set the error state
        openModal(); // Show the modal
      }
    });
  };
  return (
    <div>
      <DropdownMenuItem
        defaultChecked={true}
        className="bg-destructive"
        onClick={handleDelete}
      >
        Delete Page
      </DropdownMenuItem>

      {/* Conditionally render the ErrorModal based on state */}

      {isModalOpen && (
        <ErrorModal
          show={isModalOpen}
          message={error}
          onClose={closeModal}
          onConfirm={closeModal}
          // Close the modal
        />
      )}
    </div>
  );
}
export default DeleteCust;
