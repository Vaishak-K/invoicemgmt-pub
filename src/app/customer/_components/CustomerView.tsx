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
import { MoreVertical, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { ChangeName } from "./ChangeName";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteCust from "@/components/DeleteCust";
import ModalUsersTable from "./ModalUsersTable";

const CUSTOMERS_PER_PAGE = 15;

export default function CustomerView({ addData }: any) {
  const [adddata, setAddData] = useState(addData);
  const totalCustomers = adddata ? adddata?.length : 0;
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ChangeName(sortOption);
        setAddData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortOption]);

  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE);

  const filtered = useMemo(
    () =>
      adddata
        ? adddata?.filter((data: any) =>
            data?.name.toLowerCase().includes(searchInput.toLowerCase())
          )
        : [],
    [searchInput, adddata]
  );

  const handleSortChange = (e: any) => {
    setSortOption(e.target.value);
  };

  const startIndex = (currentPage - 1) * CUSTOMERS_PER_PAGE;
  const currentCustomers = filtered?.slice(
    startIndex,
    startIndex + CUSTOMERS_PER_PAGE
  );
  // console.log("Current CUstomers", currentCustomers);
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Customer Management
          </h1>
        </div>

        {/* Header and Action Buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="customer/new" passHref>
              <Button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white transition duration-300 flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Create New Customer</span>
              </Button>
            </Link>
            <div>
              <ModalUsersTable />
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="p-6 bg-white">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Input
                id="search"
                type="text"
                name="search"
                placeholder="Search customers by name..."
                className="pl-10 w-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200"
                onChange={(e) => setSearchInput(e.target.value)}
                autoComplete="off"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full md:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-teal-300"
            >
              <option value="default">Sort By</option>
              <option value="creditAsc">Price: Low to High</option>
              <option value="creditDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableCaption className="text-gray-500 bg-gray-50 p-4">
              Showing {currentCustomers?.length} of {totalCustomers} customers
            </TableCaption>
            <TableHeader className="bg-teal-50">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Customer ID
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Customer Name
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Updated Time
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-teal-700 font-bold uppercase tracking-wider">
                  Credit
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-teal-700 font-bold uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: CUSTOMERS_PER_PAGE }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                      {[...Array(5)].map((_, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className="px-6 py-4 border-b"
                        >
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : currentCustomers?.map((data: any) => (
                    <TableRow
                      key={data.id}
                      className="hover:bg-teal-50 transition duration-150"
                    >
                      <TableCell className="px-6 py-4 text-gray-700">
                        {data.id}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Link
                          href={`/customer/${data.id}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline font-semibold"
                        >
                          {data.name}
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600">
                        {data.updatedAt}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                            data.Credit > 0
                              ? "bg-red-100 text-red-700"
                              : data.Credit < 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {Math.abs(data.Credit)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="text-gray-500 hover:text-teal-600 transition duration-300" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel className="text-teal-700">
                              Customer Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                href={`/customer/${data.id}`}
                                className="w-full"
                              >
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/customer/${data.id}/edit`}
                                className="w-full"
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteCust id={data.id} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full md:w-auto mb-4 md:mb-0 bg-teal-600 hover:bg-teal-700 text-white"
          >
            Previous
          </Button>
          <span className="text-gray-600 mb-4 md:mb-0">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
