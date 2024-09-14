// "use client";

// // CreditChart.js
// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const CreditChart = () => {
//   const [chartData, setChartData] = useState<any>({
//     labels: [],
//     datasets: [
//       {
//         label: "Credits per Day",
//         data: [],
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//       },
//     ],
//   });

//   useEffect(() => {
//     const fetchCredits = async () => {
//       const db = await prisma.customer.findMany();
//       const creditsPerDay: any = {};

//       // Aggregate credits per day
//       db.forEach((customer: any) => {
//         const date = new Date(customer.createdAt).toDateString();
//         creditsPerDay[date] = (creditsPerDay[date] || 0) + 1; // Increment credit count for the day
//       });

//       // Prepare data for the chart
//       const labels = Object.keys(creditsPerDay);
//       const data = Object.values(creditsPerDay);

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Credits per Day",
//             data,
//             borderColor: "rgba(75, 192, 192, 1)",
//             backgroundColor: "rgba(75, 192, 192, 0.2)",
//             fill: true,
//           },
//         ],
//       });
//     };

//     fetchCredits();
//   }, []);

//   return (
//     <div>
//       <h2>Credits per Day</h2>
//       <Line
//         data={chartData}
//         options={{ responsive: true, plugins: { legend: { position: "top" } } }}
//       />
//     </div>
//   );
// };

// export default CreditChart;
