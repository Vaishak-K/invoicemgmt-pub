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

import DeleteEstimate1 from "./DeleteEstimate";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Simulate fetching invoices from an API (replace with real data fetching)
const ESTIMATES_PER_PAGE = 15;

export default function EstimateView({ estimateData }: { estimateData: any }) {
  const totalEstimates = estimateData.length;
  const totalPages = Math.ceil(totalEstimates / ESTIMATES_PER_PAGE);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate loading data (use actual data fetching in a real app)
    const timer = setTimeout(() => setLoading(false), 500); // Simulate 1.5s loading
    return () => clearTimeout(timer);
  }, []);

  // Calculate which invoices to display
  const startIndex = (currentPage - 1) * ESTIMATES_PER_PAGE;
  const currentEstimates = estimateData.slice(
    startIndex,
    startIndex + ESTIMATES_PER_PAGE
  );

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <TableCaption className="text-gray-600">List of Invoices</TableCaption>
      <TableHeader>
        <TableRow className="bg-teal-100">
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-left text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
          </TableHead>
          <TableHead className="p-4 text-center text-gray-800 font-semibold">
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: ESTIMATES_PER_PAGE }).map((_, index) => (
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
              <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
            </TableCell>
            <TableCell className="p-3 border-t border-gray-300 text-gray-700">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
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
            Estimates List
          </h1>
        </div>

        {/* Header and Action Buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="/estimate/new" passHref>
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300 flex items-center space-x-2">
                <p className="block w-full text-center py-2">
                  Create a New Estimate
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
                Overview of Estimates
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-teal-100">
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Estimate ID
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Customer Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Total
                  </TableHead>
                  <TableHead className="p-4 text-left text-gray-800 font-semibold">
                    Last Updated
                  </TableHead>
                  <TableHead className="p-4 text-center text-gray-800 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEstimates.map((estimate: any) => (
                  <TableRow
                    key={estimate.id}
                    className="hover:bg-teal-50 transition duration-200"
                  >
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {estimate.id}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      <Link href={`/estimate/${estimate.id}`}>
                        {estimate.customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      Rs. {estimate.total}
                    </TableCell>
                    <TableCell className="p-3 border-t border-gray-300 text-gray-700">
                      {estimate.updatedAt}
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
                            <Link href={`/estimate/${estimate.id}`}>View</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-teal-100 transition duration-150">
                            <Link href={`/estimate/${estimate.id}/edit`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DeleteEstimate1 id={estimate.id} />
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
          <p className="text-gray-700 text-lg">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ESTIMATES_PER_PAGE, totalEstimates)} of{" "}
            {totalEstimates} estimates
          </p>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>
            <span className="text-gray-700">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
