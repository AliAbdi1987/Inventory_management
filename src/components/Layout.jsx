import React from "react";
import { Link, Outlet } from "react-router-dom";
import InventrixLogo from "../assets/Inventrix-logo.png";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#121e31] text-white py-4">
        <ul>
          <li className="flex ml-10 justify-between items-center">
            <Link
              to="/"
              className={
                "mr-80 text-3xl font-bold text-amber-500 font-Arial hover:text-amber-200"
              }
            >
              INVENTRIX
            </Link>
            <li className={"flex justify-center flex-1"}>
              <img
                src={InventrixLogo}
                alt="Inventrix Logo"
                className={"w-20 h-auto"}
              />
            </li>
            <li className="flex-grow flex justify-end pr-4 space-x-2 sm:space-x-4">
              <Link to="/signup" className={"hover:text-amber-500"}>
                <button className="bg-amber-100 text-black font-semibold px-2 py-1 rounded-md flex items-center justify-center hover:bg-amber-500 hover:text-black">
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-black mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                  </svg>
                  Sign Up
                </button>
              </Link>
            </li>
            <li className="flex pr-4 space-x-4">
              <Link to="/login" className="hover:text-amber-500">
                <button className="bg-amber-500 text-black font-semibold px-4 py-1 rounded-md flex items-center justify-center hover:bg-amber-100 hover:text-black">
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-black mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  Login
                </button>
              </Link>
            </li>
            {/* <li className={"pr-4"}>
              <Link
                to="/"
                className={"hover:text-amber-500 font-semibold"}
              >
                Home
              </Link>
            </li> */}
            <li className={"pr-4"}>
              <Link
                to="/about"
                className={"hover:text-amber-500 font-semibold"}
              >
                About
              </Link>
            </li>
            <li className={"mr-10"}>
              <Link
                to="/contact"
                className={"hover:text-amber-500 font-semibold"}
              >
                Contact
              </Link>
            </li>
          </li>
        </ul>
      </header>
      <Outlet />
      <footer className="bg-[#121e31] text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Inventrix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;