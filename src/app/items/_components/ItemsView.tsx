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
import DeleteItem from "@/components/DeleteItem";
import { Button } from "@/components/ui/button";
import ModalItemsTable from "./ModalItemsTable";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { SortItems } from "./SortItems";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

const ITEMS_PER_PAGE = 15;

export default function ItemsView({ itemsData }: { itemsData: any }) {
  const [itemsdata, setItemsData] = useState(itemsData);
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SortItems(sortOption); // Fetch data from an API
        setItemsData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, [sortOption]);

  const totalItems = itemsdata.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const filtered = useMemo(
    () =>
      itemsdata?.filter((data: any) =>
        data?.itemname.toLowerCase().includes(searchInput.toLowerCase())
      ),
    [searchInput, itemsdata]
  );

  // Calculate which items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSortChange = (e: any) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            Inventory Management
          </h1>
        </div>

        {/* Header and Action Buttons */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <Link href="items/new" passHref>
              <Button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white transition duration-300 flex items-center space-x-2">
                <span>Create New Item</span>
              </Button>
            </Link>
            <div>
              <ModalItemsTable />
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
                placeholder="Search items by name..."
                className="pl-10 w-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200"
                onChange={(e) => setSearchInput(e.target.value)}
                autoComplete="off"
              />
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full md:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-teal-300"
            >
              <option value="default">Sort By</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableCaption className="text-gray-500 bg-gray-50 p-4">
              Showing {currentItems.length} of {totalItems} items
            </TableCaption>
            <TableHeader className="bg-teal-50">
              <TableRow>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Item ID
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Item Name
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Quantity
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Price
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-teal-700 font-bold uppercase tracking-wider">
                  Last Updated
                </TableHead>
                <TableHead className="px-6 py-4 text-center text-teal-700 font-bold uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <TableRow key={index} className="hover:bg-gray-100">
                      {[...Array(6)].map((_, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className="px-6 py-4 border-b"
                        >
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : currentItems.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-teal-50 transition duration-150"
                    >
                      <TableCell className="px-6 py-4 text-gray-700">
                        {item.id}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Link
                          href={`/items/${item.id}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline font-semibold"
                        >
                          {item.itemname}
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        {item.qty}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600">
                        {item.updatedAt}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="text-gray-500 hover:text-teal-600 transition duration-300" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel className="text-sm text-gray-600">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link href={`/items/${item?.id}/edit`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DeleteItem id={item.id} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-white flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Prev
            </Button>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
