"use client";

import React, { useState } from "react";
import {
  FiBarChart,
  FiBook,
  FiBookOpen,
  FiChevronDown,
  FiChevronsRight,
  FiDatabase,
  FiDollarSign,
  FiFile,
  FiFilePlus,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMonitor,
  FiPaperclip,
  FiShoppingCart,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import { logout } from "@/app/login/actions";

export const NewNavBar = () => {
  return (
    <div className="flex bg-teal-50">
      <Sidebar />
      {/* <ExampleContent /> */}
    </div>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Home");

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />
      <div className="flex flex-col justify-between h-4/5">
        <div className="space-y-1">
          <Option
            Icon={FiHome}
            title="Home"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/"
          />
          <Option
            Icon={FiUsers}
            title="Customer"
            selected={selected}
            setSelected={setSelected}
            open={open}
            newpage="/customer/new"
            href="/customer"
          />
          <Option
            Icon={FiDatabase}
            title="Items"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/items"
            newpage="/items/new"
          />
          <Option
            Icon={FiFileText}
            title="Invoices"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/invoice"
            newpage="/invoice/new"
          />
          <Option
            Icon={FiPaperclip}
            title="Expenses"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/expenses"
            newpage="/expenses/new"
          />
          <Option
            Icon={FiDollarSign}
            title="Payments"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/payments"
            newpage="/payments/new"
          />
          <Option
            Icon={FiFile}
            title="Estimate"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/estimate"
            newpage="/estimate/new"
          />
          <Option
            Icon={FiTruck}
            title="Delivery Challan"
            selected={selected}
            setSelected={setSelected}
            open={open}
            href="/deliverychallan"
            newpage="/deliverychallan/new"
          />
        </div>
        <Option2
          Icon={FiLogOut}
          title="Logout"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option2 = ({ Icon, title, selected, setSelected, open }: any) => {
  return (
    <motion.button
      layout
      onClick={() => logout()}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-teal-100 text-teal-800"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg text-red-400"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium text-red-400"
        >
          {title}
        </motion.span>
      )}
    </motion.button>
  );
};
const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  newpage,
  href,
}: any) => {
  return (
    <Link href={href}>
      <motion.button
        layout
        onClick={() => setSelected(title)}
        className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
          selected === title
            ? "bg-teal-100 text-teal-800"
            : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        <motion.div
          layout
          className="grid h-full w-10 place-content-center text-lg"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            {title}
          </motion.span>
        )}

        {newpage && open && (
          <Link href={newpage}>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              style={{ y: "-50%" }}
              transition={{ delay: 0.5 }}
              className="absolute right-2 -bottom-2 top-1/2 size-6 rounded bg-teal-500 text-sm text-white"
            >
              +
            </motion.span>
          </Link>
        )}
      </motion.button>
    </Link>
  );
};

const TitleSection = ({ open }: any) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">
                Hello,billing123
              </span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-teal-600"
    >
      <svg
        fill="#e6fff2"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        width="30px"
        height="30px"
        viewBox="0 0 194.578 194.578"
      >
        <g>
          <g>
            <path
              d="M131.63,154.985c-13.655,2.514-27.266,4.146-41.121,5.012c-11.567,0.722-24.1-2.17-35.34-0.341
			c-1.497,0.243-1.356,2.19-0.378,2.893c8.95,6.41,25.31,4.938,35.718,4.885c14.37-0.075,29.186-1.665,43.188-4.949
			C138.629,161.328,136.494,154.091,131.63,154.985z"
            />
            <path
              d="M133.887,140.212c-25.752-0.177-51.308,4.705-77.074,2.057c-2.027-0.208-2.401,3.042-0.475,3.508
			c25.477,6.159,51.632,2.952,77.548,2.121C138.829,147.739,138.854,140.246,133.887,140.212z"
            />
            <path
              d="M131.183,125.96c-6.714-5.466-18.58-2.789-26.56-2.148c-15.19,1.222-30.114,3.04-45.364,1.829
			c-2.829-0.224-3.418,4.34-0.667,4.929c12.474,2.668,25.634,1.842,38.287,1.232c10.113-0.488,23.337,1.895,32.938-0.666
			C131.903,130.581,133.034,127.467,131.183,125.96z"
            />
            <path
              d="M170.956,72.59c-1.164-0.114-2.355-0.147-3.531-0.228c0.602-3.818,0.049-8.12,0.059-11.808
			c0.013-5.607,0.024-11.213,0.038-16.82c0.005-2.166-1.953-4.486-4.272-4.271c-6.293,0.582-12.552,1.486-18.806,2.383
			c-0.349-7.504-0.093-14.965,0.109-22.58c0.068-2.571-2.125-4.427-4.549-4.548c-30.206-1.516-60.353-4.598-90.532-1.142
			c-2.681,0.307-4.114,1.825-4.467,4.466c-1.026,7.686-0.754,15.198,0.361,22.635c-6.018-0.505-11.756,0.314-17.783,1.546
			c-1.298,0.265-2.609,1.563-2.867,2.867c-2.052,10.379-2.199,21.734,0.521,32.108c-6.604,0.566-13.206,1.231-19.807,2.094
			c-2.718,0.356-4.659,1.928-4.815,4.815c-1.15,21.298-1.174,42.466,4.297,63.211c0.481,1.821,2.331,2.416,3.864,2.025
			c0.351,0.271,0.753,0.483,1.251,0.557c5.507,0.827,11.11,1.178,16.676,1.235c2.941,0.03,6.173,0.312,9.334,0.307
			c-0.651,6.957-1.54,13.891-3.312,20.73c-0.607,2.343,0.742,5.236,3.268,5.757c36.97,7.618,75.242,4.194,112.574,1.481
			c2.866-0.208,4.404-2.038,4.77-4.771c1.007-7.539,0.901-14.979,0.153-22.358c0.074,0.025,0.134,0.072,0.209,0.096
			c3.189,0.972,7.023,0.841,10.315,0.842c6.708,0.003,15.559,0.235,21.788-2.554c1.614-0.723,2.286-2.025,2.328-3.4
			c2.032-0.915,3.638-2.99,3.179-5.762C186.983,115.37,211.045,76.514,170.956,72.59z M76.887,21.07
			c19.507-0.273,39.042,1.547,58.529,2.503c-0.1,9.638-0.176,19.051,1.975,28.559c0.115,0.511,0.334,0.936,0.605,1.303
			c-13.433-2.096-28.057,0.417-41.52,1.149C82.44,55.349,68.484,55.76,54.481,55.35c-0.646-6.871-1.352-13.712-1.706-20.614
			C51.923,18.143,64.484,21.245,76.887,21.07z M144.164,170.207c-33.568,2.58-68.068,5.505-101.358-0.5
			c3.411-17.006,2.827-34.171,3.056-51.513c30.496,1.843,60.884-3.011,91.427,0.359
			C141.024,135.682,145.451,152.653,144.164,170.207z"
            />
            <path
              d="M124.791,42.452c-3.717-0.634-7.341,0.608-11.046,1.001c-7.452,0.793-15.024,0.797-22.508,0.837
			c-6.697,0.035-25.986-3.525-31.203,1.444c-0.25,0.238-0.239,0.656,0,0.895c2.111,2.109,6.324,1.69,9.077,2.016
			c8.359,0.989,16.744,1.533,25.149,1.954c7.424,0.373,27.35,3.736,32.083-4.328C127.13,44.932,126.471,42.739,124.791,42.452z"
            />
            <path
              d="M127.592,29.23c-4.955-4.599-21.873-0.627-28.105-0.486C92.358,28.907,85.231,29.07,78.1,28.99
			c-0.931-0.01-10.444,0.849-10.716,0.503c-0.814-1.033-2.287,0.282-1.74,1.343c3.169,6.143,21.026,4.489,26.317,4.748
			c7.877,0.385,15.771,0.471,23.657,0.433c3.89-0.019,10.086,1.01,12.477-2.897C128.826,31.927,128.629,30.192,127.592,29.23z"
            />
          </g>
        </g>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv: any) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

// const ExampleContent = () => <div className="h-[200vh] w-full"></div>;
