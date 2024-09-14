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
import { ChangePayments } from "./SortPayments";
import DeletePayment from "./DeletePayment";
import { SkeletonTable } from "../_components/Skeleton";
import { Input } from "@/components/ui/input";

const EXPENSES_PER_PAGE = 15;

export default function PaymentsView({ addData }: { addData: any }) {
  const [adddata, setAddData] = useState(addData);

  const totalExpenses = adddata.length;
  const [sortOption, setSortOption] = useState("default");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChangePayments(sortOption); // Fetch data from an API
        setAddData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, [sortOption]);

  const totalPages = Math.ceil(totalExpenses / EXPENSES_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const filtered = useMemo(
    () =>
      adddata?.filter(
        (data: any) =>
          data?.Customer?.name &&
          typeof data?.Customer?.name === "string" &&
          data?.Customer?.name.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, adddata]
  );
  // console.log("AddData", adddata);
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Payments List
          </h1>
        </div>

        {/* Header and Action Buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/payments/new" passHref>
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300 flex items-center space-x-2">
                <p className="block w-full text-center py-2">
                  Enter a New Payment
                </p>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between mb-6">
            <Input
              id="search"
              type="text"
              name="search"
              placeholder="Search by Customer Name..."
              className="mb-6 max-w-96"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="default">Select Sorting</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Table content or skeleton */}
        {loading ? (
          <SkeletonTable />
        ) : (
          <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
            <TableCaption className="text-gray-600">
              Overview of Payments
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
                  Payment Reason
                </TableHead>
                <TableHead className="p-4 text-left text-gray-800 font-semibold">
                  Created Time
                </TableHead>
                <TableHead className="p-4 text-right text-gray-800 font-semibold">
                  Paid Amount
                </TableHead>
                <TableHead className="p-4 text-center text-gray-800 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered
                .slice(
                  (currentPage - 1) * EXPENSES_PER_PAGE,
                  currentPage * EXPENSES_PER_PAGE
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
                      <Link href={`/payments/${data.id}`}>
                        {data?.Customer?.name}
                      </Link>
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {data.paymentreason}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {new Date(data.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="p-3 text-right border-t border-gray-300">
                      <div
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                          data.amount > 0
                            ? "bg-green-100 border border-green-300 text-green-600"
                            : data.amount < 0
                            ? "bg-red-100 border border-red-300 text-red-600"
                            : "bg-gray-100 border border-gray-300 text-gray-600"
                        }`}
                      >
                        {Math.abs(data.amount)}
                      </div>
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
                            <Link href={`/payments/${data.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-teal-100 transition duration-150">
                            <Link href={`/payments/${data.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="hover:bg-teal-100 transition duration-150 cursor-pointer">
                            <DeletePayment id={data.id} />
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
      </div>
    </div>
  );
}
