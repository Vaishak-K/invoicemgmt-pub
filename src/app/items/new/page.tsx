import PageHeader from "@/components/PageHeader";
import React from "react";
import ItemForm from "../_components/ItemForm";
export const runtime = "edge";
function newitem() {
  return (
    <>
      <PageHeader message="New Item" />
      <ItemForm />
    </>
  );
}

export default newitem;
