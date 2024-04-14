import { Link } from "react-router-dom";
import React from "react";
import { useContext, useEffect } from "react";
import BusinessContext from "../contexts/BusinessContext";

const SalesSideBar = () => {
  const { currentBusiness } = useContext(BusinessContext);

  useEffect(() => {
    console.log(currentBusiness);
  }, [currentBusiness]);

  const fetchBusinessNameFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).name : "Business";
  };
  const businessName = fetchBusinessNameFromLocalStorage();

  const deleteBusinessInfo = () => {
    localStorage.removeItem("businessInfo");
}

const loggedOut = () => {
  localStorage.clear();
};

  return (
    <>
      <nav className="h-screen fixed flex-col justify-center items-center bg-[#121e31] w-100 top-0 left-0 min-w-[250px] py-6 px-4 font-[sans-serif] overflow-auto">
        <div className="relative flex flex-col items-center h-full">
          <Link
            to="/"
            className={
              "text-3xl font-bold text-amber-500 font-Arial hover:text-amber-200"
            }
          >
            INVENTRIX
          </Link>
          <ul className="space-y-3 my-3 flex-1">
            <li className="flex justify-start items-center pl-2">
              <h1 className="flex justify-center items-center mt-3 text-xl font-semibold text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#ffffff"
                  className="w-6 h-6 mr-4"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M197.332 170.668h-160C16.746 170.668 0 153.922 0 133.332v-96C0 16.746 16.746 0 37.332 0h160c20.59 0 37.336 16.746 37.336 37.332v96c0 20.59-16.746 37.336-37.336 37.336zM37.332 32A5.336 5.336 0 0 0 32 37.332v96a5.337 5.337 0 0 0 5.332 5.336h160a5.338 5.338 0 0 0 5.336-5.336v-96A5.337 5.337 0 0 0 197.332 32zm160 480h-160C16.746 512 0 495.254 0 474.668v-224c0-20.59 16.746-37.336 37.332-37.336h160c20.59 0 37.336 16.746 37.336 37.336v224c0 20.586-16.746 37.332-37.336 37.332zm-160-266.668A5.337 5.337 0 0 0 32 250.668v224A5.336 5.336 0 0 0 37.332 480h160a5.337 5.337 0 0 0 5.336-5.332v-224a5.338 5.338 0 0 0-5.336-5.336zM474.668 512h-160c-20.59 0-37.336-16.746-37.336-37.332v-96c0-20.59 16.746-37.336 37.336-37.336h160c20.586 0 37.332 16.746 37.332 37.336v96C512 495.254 495.254 512 474.668 512zm-160-138.668a5.338 5.338 0 0 0-5.336 5.336v96a5.337 5.337 0 0 0 5.336 5.332h160a5.336 5.336 0 0 0 5.332-5.332v-96a5.337 5.337 0 0 0-5.332-5.336zm160-74.664h-160c-20.59 0-37.336-16.746-37.336-37.336v-224C277.332 16.746 294.078 0 314.668 0h160C495.254 0 512 16.746 512 37.332v224c0 20.59-16.746 37.336-37.332 37.336zM314.668 32a5.337 5.337 0 0 0-5.336 5.332v224a5.338 5.338 0 0 0 5.336 5.336h160a5.337 5.337 0 0 0 5.332-5.336v-224A5.336 5.336 0 0 0 474.668 32zm0 0"
                    data-original="#000000"
                  />
                </svg>

                {businessName}
              </h1>
            </li>
            <li className="flex items-start pt-3">
              <Link to="/business/employees">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[110px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    viewBox="0 0 20 20"
                    style={{ marginRight: "20px" }}
                  >
                    <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                    <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                  </svg>
                  Employees
                </a>
              </Link>
            </li>
            <li className="flex items-start">
              <Link to="/business/suppliers">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[121px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 18"
                    style={{ marginRight: "20px" }}
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 14 3-3m-3 3 3 3m-3-3h16v-3m2-7-3 3m3-3-3-3m3 3H3v3"
                    />
                  </svg>
                  Suppliers
                </a>
              </Link>
            </li>
            <li className="flex items-start">
              <Link to="/business/customers">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[111px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    viewBox="0 0 20 18"
                    style={{ marginRight: "20px" }}
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  Customers
                </a>
              </Link>
            </li>
            <li className="flex items-start">
              <Link to="/business/inventory">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[123px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    style={{ marginRight: "20px" }}
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
                    />
                  </svg>
                  Inventory
                </a>
              </Link>
            </li>
            <li className="flex items-start">
              <Link to="/business/products">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[125px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    viewBox="0 0 18 20"
                    style={{ marginRight: "20px" }}
                  >
                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                  </svg>
                  Products
                </a>
              </Link>
            </li>
            <li className="flex items-start">
                <a className="text-white bg-gray-700 text-sm flex items-center rounded pr-[145px] pl-2 py-3 w-full text-center">
                  <svg
                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    viewBox="0 0 22 21"
                    style={{ marginRight: "20px" }}
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  Sales
                </a>
            </li>
            <li className="flex items-start">
              <Link to="/business/orders">
                <a
                  href="#"
                  className="text-white text-sm flex items-center hover:bg-gray-700 rounded pr-[137px] pl-2 py-3 transition-all cursor-pointer w-full text-center"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    viewBox="0 0 18 18"
                    style={{ marginRight: "20px" }}
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                  Orders
                </a>
              </Link>
            </li>
          </ul>
          <li className="flex items-start">
            <Link
              onClick={deleteBusinessInfo}
              to="/dashboard"
              className={
                "flex justify-center items-center text-white hover:bg-amber-500 rounded px-[25px] py-3 transition-all cursor-pointer w-full text-center"
              }
            >
              <svg
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 16"
                style={{ marginRight: "20px" }}
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1v14m8.336-.479-6.5-5.774a1 1 0 0 1 0-1.494l6.5-5.774A1 1 0 0 1 11 2.227v11.546a1 1 0 0 1-1.664.748Z"
                />
              </svg>
              Back to Businesses
            </Link>
          </li>
          <li className="flex items-start">
            <Link
              onClick={loggedOut}
              to="/login"
              className={
                "flex justify-center items-center text-white hover:bg-amber-500 rounded px-[70.5px] py-3 transition-all cursor-pointer w-full text-center"
              }
            >
              <svg
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
                style={{ marginRight: "20px", transform: "rotate(-180deg)" }}
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
            </Link>
          </li>
        </div>
      </nav>
    </>
  );
};

export default SalesSideBar;
