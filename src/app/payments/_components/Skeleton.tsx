import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a skeleton component, otherwise create one
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Skeleton loader for the table rows
const SkeletonTableRow = () => (
  <TableRow className="animate-pulse hover:bg-teal-50 transition duration-200">
    <TableCell className="p-3 border-t border-gray-300">
      <Skeleton className="w-16 h-4" />
    </TableCell>
    <TableCell className="p-3 border-t border-gray-300">
      <Skeleton className="w-24 h-4" />
    </TableCell>
    <TableCell className="p-3 border-t border-gray-300">
      <Skeleton className="w-16 h-4" />
    </TableCell>
    <TableCell className="p-3 text-right border-t border-gray-300">
      <Skeleton className="w-20 h-4" />
    </TableCell>
    <TableCell className="p-3 text-center border-t border-gray-300">
      <Skeleton className="w-16 h-4" />
    </TableCell>
  </TableRow>
);

// Skeleton loader for the entire table
export const SkeletonTable = () => (
  <Table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
    <TableCaption className="text-gray-600">
      <Skeleton className="w-32 h-4" />
    </TableCaption>
    <TableHeader>
      <TableRow className="bg-teal-100">
        <TableHead className="p-4 text-left text-gray-800 font-semibold">
          <Skeleton className="w-10 h-4" />
        </TableHead>
        <TableHead className="p-4 text-left text-gray-800 font-semibold">
          <Skeleton className="w-24 h-4" />
        </TableHead>
        <TableHead className="p-4 text-left text-gray-800 font-semibold">
          <Skeleton className="w-20 h-4" />
        </TableHead>
        <TableHead className="p-4 text-right text-gray-800 font-semibold">
          <Skeleton className="w-16 h-4" />
        </TableHead>
        <TableHead className="p-4 text-center text-gray-800 font-semibold">
          <Skeleton className="w-16 h-4" />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <SkeletonTableRow key={index} />
      ))}
    </TableBody>
  </Table>
);
