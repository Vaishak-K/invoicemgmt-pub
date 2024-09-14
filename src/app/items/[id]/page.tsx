import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

type CustomerProps = {
  params: {
    id: string;
  };
};
export const runtime = "edge";

async function ViewItem({ params }: CustomerProps) {
  const supabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
  const id = params.id;
  const { data: item, error } = await supabase
    .from("Item")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-gray-50">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-teal-600">
            Item Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{item?.itemname}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Quantity:</span>
            <span>{item?.qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Price:</span>
            <span>Rs. {item?.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax:</span>
            <span>{item?.tax}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Stock Last Updated:</span>
            <span>{item?.updatedAt}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewItem;
