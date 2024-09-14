"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

import { Button } from "./ui/button";
import { logout } from "@/app/login/actions";

function Navbar() {
  const [navOn, setNavOn] = useState<boolean>(false);

  const handleToggle = () => {
    setNavOn(!navOn);
  };

  return (
    <div className="flex bg-gradient-to-r justify-between p-4  from-teal-600 to-teal-400 shadow-lg">
      <button
        className="text-white text-3xl "
        onClick={handleToggle}
        aria-label="Toggle Navigation"
      >
        {navOn ? <HiX /> : <HiMenu />}
      </button>
      <nav className="flex flex-col  justify-between z-50">
        {navOn && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleToggle}
          />
        )}
        <ul
          className={`fixed top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-300 z-50 p-4 shadow-lg  transition-transform transform ${
            navOn ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          } duration-300 ease-in-out`}
        >
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/"
            >
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/customer"
            >
              Customer
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/items"
            >
              Item
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/invoice"
            >
              Invoice
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/expenses"
            >
              Expenses
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/payments"
            >
              Payments
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/estimate"
            >
              Estimate
            </Link>
          </li>
          <li className="mb-4">
            <Link
              className="text-white text-xl font-semibold hover:text-teal-200 transition"
              onClick={handleToggle}
              href="/deliverychallan"
            >
              Delivery Challan
            </Link>
          </li>
        </ul>
      </nav>

      <h1 className="text-xl text-white font-bold">Hi Menu</h1>
      <Button onClick={() => logout()}>Log out</Button>
    </div>
  );
}

export default Navbar;

//Navbar
{
  /* <div className="flex items-center">
        <div className="text-white text-2xl font-bold">MyApp</div>
      </div>
      <ul className={`hidden md:flex md:items-center md:space-x-6`}>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/customer"
          >
            Customer
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/items"
          >
            Item
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/invoice"
          >
            Invoice
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/expenses"
          >
            Expenses
          </Link>
        </li>

        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/payments"
          >
            Payments
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/estimate"
          >
            Estimate
          </Link>
        </li>
        <li>
          <Link
            className="text-white text-xl font-semibold hover:text-teal-300 transition"
            href="/deliverychallan"
          >
            Delivery Challan
          </Link>
        </li>
      </ul> */
}
