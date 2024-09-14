"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { SkeletonTable } from "@/app/payments/_components/Skeleton";
import DeletePayment from "@/app/payments/_components/DeletePayment";
import { ChangeChallan } from "./ChangeChallan";
import { DeleteChallan } from "@/app/actions/deliverychallan";
import DeleteDelChallan from "./DeleteChallan";

const CHALLANS_PER_PAGE = 15;

export default function DeliveryChallanView({ addData }: { addData: any }) {
  const [adddata, setAddData] = useState(addData);
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await ChangeChallan(sortOption); // Fetch data from an API
  //       setAddData(response);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData(); // Fetch data whenever the sortOption changes
  // }, [sortOption]);

  const totalChallan = adddata.length;
  const totalPages = Math.ceil(totalChallan / CHALLANS_PER_PAGE);

  const filtered = useMemo(
    () =>
      adddata?.filter(
        (data: any) =>
          data?.customer?.name &&
          typeof data?.customer?.name === "string" &&
          data?.customer?.name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, adddata]
  );

  const handleSortChange = async (e: any) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Delivery Challan
          </h1>
        </div>

        {/* Action buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/deliverychallan/new" passHref>
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300 flex items-center space-x-2">
                <p className="block w-full text-center py-2">
                  Enter a New Delivery Challan
                </p>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between mb-6">
            <Input
              id="search"
              type="text"
              name="search"
              placeholder="Search by Customer Name..."
              className="max-w-96"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {/* <select
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="default">Select Sorting</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select> */}
          </div>
        </div>

        {/* Table content or skeleton */}
        {loading ? (
          <SkeletonTable />
        ) : (
          <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <TableCaption className="text-gray-600">
              Overview of Challans
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-teal-100">
                <TableHead className="p-4 text-left text-gray-800 font-semibold">
                  ID
                </TableHead>
                <TableHead className="p-4 text-left text-gray-800 font-semibold">
                  Customer Name
                </TableHead>
                <TableHead className="p-4 text-left text-gray-800 font-semibold">
                  Created Time
                </TableHead>
                <TableHead className="p-4 text-center text-gray-800 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered
                .slice(
                  (currentPage - 1) * CHALLANS_PER_PAGE,
                  currentPage * CHALLANS_PER_PAGE
                )
                .map((data: any) => (
                  <TableRow
                    key={data.id}
                    className="hover:bg-teal-50 transition duration-200"
                  >
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {data.id}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      <Link href={`/deliverychallan/${data.id}`}>
                        {data?.customer?.name}
                      </Link>
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {new Date(data.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="p-3 text-center border-t border-gray-300">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="cursor-pointer hover:text-teal-600 transition duration-300" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className="text-gray-800">
                            Options
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="hover:bg-teal-100 transition duration-150">
                            <Link href={`/deliverychallan/${data.id}`}>
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-teal-100 transition duration-150">
                            <Link href={`/deliverychallan/${data.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="hover:bg-teal-100 transition duration-150 cursor-pointer">
                            <DeleteDelChallan id={data.id} />
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-6 bg-gray-50 border-t border-gray-200">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto mb-2 sm:mb-0"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            Next
          </Button>
        </div>

        {/* Optional: Display total balance */}
        {/* {!loading && (
          <div className="mt-4 flex justify-end items-center text-lg font-semibold text-gray-900">
            <span>Total Balance: </span>
            <span className="ml-2 text-teal-500">
              {adddata
                ?.reduce((sum: number, challan: any) => sum + challan.amount, 0)
                .toFixed(2)}
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
}
