import React from "react";
import { Link, Outlet } from "react-router-dom";
import InventrixLogo from "../assets/Inventrix-logo.png";

function Layout() {
  const loggedOut = () => {
    localStorage.clear();
  };
  const handleClick = (event) => {
    loggedOut();
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#121e31] text-white py-4">
        <ul>
          <li className="flex ml-10 justify-between items-center">
            <Link
                to="/dashboard"
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
            <li onClick={handleClick} className="flex justify-end pr-4 space-x-2 sm:space-x-4">
              <Link to="/login" className="hover:text-amber-500">
                <button
                    className="bg-amber-500 text-black font-semibold px-5 py-1 rounded-md flex items-center justify-center hover:bg-amber-200 hover:text-black">
                  <svg
                      className="w-5 h-5 text-gray-800 dark:text-black mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 16"
                      style={{transform: "rotate(-180deg)"}}
                  >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
                    />
                  </svg>
                  Logout
                </button>
              </Link>
            </li>
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
      <Outlet/>
      <footer className="bg-[#121e31] text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Inventrix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
