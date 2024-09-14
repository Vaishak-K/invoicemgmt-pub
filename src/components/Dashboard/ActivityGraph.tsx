"use client";

import React from "react";
import { FiUser } from "react-icons/fi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";

// const data = [
//   {
//     name: "Jan",
//     Returning: 275,
//     New: 41,
//   },
//   {
//     name: "Feb",
//     Returning: 620,
//     New: 96,
//   },
//   {
//     name: "Mar",
//     Returning: 202,
//     New: 192,
//   },
//   {
//     name: "Apr",
//     Returning: 500,
//     New: 50,
//   },
//   {
//     name: "May",
//     Returning: 355,
//     New: 400,
//   },
//   {
//     name: "Jun",
//     Returning: 875,
//     New: 200,
//   },
//   {
//     name: "Jul",
//     Returning: 700,
//     New: 205,
//   },
// ];

export const ActivityGraph = async ({ data }: any) => {
  return (
    <div className="col-span-8 w-full overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 text-sm sm:text-base font-medium ">
          <FiUser /> Credit vs Payments (Month Wise)
        </h3>
      </div>

      <div className="h-64 sm:h-[300px] px-4">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="bg-slate-200 rounded-md bg-opacity-30"
        >
          <LineChart
            data={data}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#93939f" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-xs sm:text-sm font-bold"
              padding={{ right: 4 }}
            />
            <YAxis
              className="text-xs sm:text-sm font-bold"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperClassName="text-sm rounded"
              labelClassName="text-xs text-stone-500"
            />
            <Line
              type="monotone"
              dataKey="Credit"
              stroke="#00ff00"
              fill="#1e8a8a"
            />
            <Line
              type="monotone"
              dataKey="Payment"
              stroke="#18181b"
              fill="#18181b"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
