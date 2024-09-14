import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { NewNavBar } from "@/components/NewNavBar";

const fontSans = FontSans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify the weights you want to use
  subsets: ["latin"], // Note the brackets for subsets
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "My Next App",
  description: "A modern web application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookie = cookies().get("session")?.value;

  return (
    <html lang="en">
      <body
        className={cn(
          `min-h-screen relative bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] font-sans antialiased`,
          fontSans.variable
        )}
      >
        <div className="fixed z-50 bg-white shadow-md">
          {/* {cookie ? <NewNavBar /> : ""} */}
          <NewNavBar />
        </div>
        <div className="container  px-6">
          <div className="bg-white border border-[#B2DFDB] rounded-2xl shadow-lg px-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
{
  /* <div
className={`${
  cookie
    ? "bg-white"
    : " bg-gradient-to-r from-teal-500 to-teal-900"
} border border-[#B2DFDB] rounded-2xl shadow-lg px-8`}
> */
}
