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
import { ChangeExpense } from "./SortExpenses";
import { Input } from "@/components/ui/input";
import DeleteExpense from "./DeleteExpense";

const EXPENSES_PER_PAGE = 15;

export default function ExpensesView({ addData }: { addData: any }) {
  const [adddata, setAddData] = useState(addData);

  const totalExpenses = adddata.length;
  const [sortOption, setSortOption] = useState("default");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChangeExpense(sortOption); // Fetch data from an API
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
      adddata?.filter((data: any) =>
        data?.empname.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, adddata]
  );

  // Calculate which expenses to display
  const handleSortChange = (e: any) => {
    setSortOption(e.target.value);
  };

  const startIndex = (currentPage - 1) * EXPENSES_PER_PAGE;
  const currentExpenses = filtered.slice(
    startIndex,
    startIndex + EXPENSES_PER_PAGE
  );

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <TableCaption className="text-gray-600">
        Overview of Expenses
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-teal-100">
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-right text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-center text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: EXPENSES_PER_PAGE }).map((_, index) => (
          <TableRow
            key={index}
            className="hover:bg-teal-50 transition duration-200"
          >
            <TableCell className="p-3 border-t border-gray-300 text-gray-700">
              <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
            </TableCell>
            <TableCell className="p-3 border-t border-gray-300 text-gray-700">
              <div className="h-4 bg-gray-200 w-48 rounded-md"></div>
            </TableCell>
            <TableCell className="p-3 border-t border-gray-300 text-gray-700">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
            </TableCell>
            <TableCell className="p-3 text-right border-t border-gray-300">
              <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
            </TableCell>
            <TableCell className="p-3 text-center border-t border-gray-300">
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Expenses List
          </h1>
        </div>

        {/* Header and Action Buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/expenses/new" passHref>
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300 flex items-center space-x-2">
                <p className="block w-full text-center py-2">
                  Create a New Expense
                </p>
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <TableCaption className="text-gray-600">
                Overview of Expenses
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-teal-100">
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    ID
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Employee Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Reason
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Created Time
                  </TableHead>
                  <TableHead className="p-4 text-right text-gray-800 font-semibold">
                    Final Price
                  </TableHead>
                  <TableHead className="p-4 text-center text-gray-800 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentExpenses.map((data: any) => (
                  <TableRow
                    key={data.id}
                    className="hover:bg-teal-50 transition duration-200"
                  >
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {data.id}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      <Link href={`/expenses/${data.id}`}>{data.empname}</Link>
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {data.reason}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {new Date(data.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="p-3 text-right border-t border-gray-300">
                      <div
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                          data.finalPrice > 0
                            ? "bg-red-100 border border-red-300 text-red-600"
                            : data.finalPrice < 0
                            ? "bg-green-100 border border-green-300 text-green-600"
                            : "bg-gray-100 border border-gray-300 text-gray-600"
                        }`}
                      >
                        {Math.abs(data.finalPrice)}
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
                            <Link href={`/expenses/${data.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-teal-100 transition duration-150">
                            <Link href={`/expenses/${data.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="cursor-pointer">
                            <DeleteExpense id={data.id} />
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

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
