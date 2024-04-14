import React, { useContext, useEffect, useState } from "react";
import { OwnerContext } from "../pages/MainDashboard";
import { Link, useNavigate } from "react-router-dom";
import BusinessContext from "../contexts/BusinessContext";

const BusinessDashboard = () => {
  const ownerInfo = useContext(OwnerContext);
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const { setCurrentBusiness } = useContext(BusinessContext);

  useEffect(() => {
    // Construct the endpoint using the owner_id from ownerInfo
    const endpoint = `http://localhost:8000/business/owner/${ownerInfo.owner_id}`;

    // Fetch the businesses owned by the specific owner
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            return Promise.reject(new Error("No businesses found"));
          }
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        // console.log('Fetched data: ', data);
        // Update the businesses state if data is an array
        setBusinesses(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          // console.log(data);
        }
      })
      .catch((error) => {
        // Update the error state in case of an error
        setError(`${error}`);
      });
  }, [ownerInfo.owner_id]); // Re-run this effect if ownerInfo.owner_id changes

  const navigate = useNavigate();

  const handleSelectBusiness = (business) => {
    console.log("Business selected:", business);
    setCurrentBusiness(business);
    localStorage.setItem("businessInfo", JSON.stringify(business));
    // Navigate in the next event loop tick
    setTimeout(() => navigate('/business'), 0);
  };
  const loggedOut = () => {
    localStorage.clear();
  };

  // const businessInfo = () => {
  //   localStorage.setItem("businessId", setCurrentBusiness

  // const fetchBusinessId = () => {
  //     localStorage.getItem("businessId");
  // }

  // const deleteBusinessId = () => {
  //     localStorage.removeItem("businessId");
  // }

  return (
    <>
      <nav className="h-screen fixed flex flex-col justify-start items-center bg-[#121e31] w-100 top-0 left-0 min-w-[250px] py-6 px-4 font-[sans-serif] overflow-auto">
        <div className="relative flex flex-col items-center h-full">
          <Link
              to="/"
              className={
                "text-3xl font-bold text-amber-500 font-Arial hover:text-amber-200 mb-6"
              }
          >
            INVENTRIX
          </Link>
          <h1 className="flex justify-start text-xl font-semibold text-white">
            Your businesses
          </h1>
          {error ? (
            <p className="pt-5 text-white">No business found</p>
          ) : (
            <ul className="space-y-3 mt-3 flex-1">
              {businesses.map((business) => (
                <li key={business.id} className="flex justify-start mt-3">
                  <a
                    href="#"
                    onClick={() => handleSelectBusiness(business)}
                    className="text-white text-sm flex justify-start items-center hover:bg-gray-700 rounded px-[61px] py-3 transition-all cursor-pointer w-full text-center"
                  >
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
                    {business.name}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <Link
              onClick={loggedOut}
              to="/login"
              className={
                "flex justify-center items-center text-white hover:bg-amber-500 rounded px-4 py-3 transition-all cursor-pointer w-full text-center"
              }
          >
            <svg
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
                style={{marginRight: "20px", transform: "rotate(-180deg)"}}
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
        </div>
      </nav>
    </>
  );
};

export default BusinessDashboard;
