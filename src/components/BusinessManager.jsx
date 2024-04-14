import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";
import {OwnerContext} from "../pages/MainDashboard.jsx";

function BusinessManager() {
  const ownerInfo = useContext(OwnerContext)
  // const { currentOwners } = useContext(BusinessContext);
  const [business, setBusiness] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessEmailError, setBusinessEmailError] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessPhoneNumberError, setBusinessPhoneNumberError] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessAddressError, setBusinessAddressError] = useState("");
  const [businessPostalCode, setBusinessPostalCode] = useState("");

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableBusiness, setEditableBusiness] = useState(null);

  async function fetchBusiness() {
    try {
      const response = await fetch(
        `http://localhost:8000/business/owner/${ownerInfo.owner_id}`,
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch businesses.");
      }
      setBusiness(data);
    } catch (error) {
      console.error("Error fetching businesses:", error.message);
    }
  }

  useEffect(() => {
    fetchBusiness();
  }, []);

  function deleteBusinessFromState(businessId) {
    const newBusinesses = business.filter(
      (business) => business.id !== businessId,
    );
    setBusiness(newBusinesses);
  }

  async function deleteBusiness() {
    if (selectedBusinessId == null) {
      console.error("No business ID is set for deletion");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/business/${selectedBusinessId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteBusinessFromState(selectedBusinessId);
    } catch (error) {
      console.error("Failed to delete business:", error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedBusinessId(null);
      window.location.reload();
    }
  }

  function validateForm() {
    let isValid = true;
    setBusinessNameError("");
    setBusinessEmailError("");
    setBusinessPhoneNumberError("");
    setBusinessAddressError("");

    if (!businessName.trim()) {
      setBusinessNameError("Business name is required");
      isValid = false;
    }

    if (!businessEmail.trim()) {
      setBusinessEmailError("Business email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(businessEmail)) {
      setBusinessEmailError("Email address is invalid");
      isValid = false;
    }

    if (!businessPhoneNumber.trim()) {
      setBusinessPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (!/^\+?(\d.*){3,}$/.test(businessPhoneNumber)) {
      setBusinessPhoneNumberError("Phone number is invalid");
      isValid = false;
    }

    if (!businessAddress.trim()) {
      setBusinessAddressError("Address is required");
      isValid = false;
    }

    return isValid;
  }

  const handleEditClick = (business) => {
    setIsEditMode(true);
    setEditableBusiness(business);
    setShowAddModal(true);
    setBusinessName(business.name);
    setBusinessEmail(business.email);
    setBusinessPhoneNumber(business.phone_number);
    setBusinessAddress(business.address);
    setBusinessPostalCode(business.postal_code);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const businessData = JSON.stringify({
      name: businessName,
      phone_number: businessPhoneNumber,
      address: businessAddress,
      postal_code: businessPostalCode,
      email: businessEmail,
      owner_id: ownerInfo.owner_id
    });

    const url = isEditMode
      ? `http://localhost:8000/business/${editableBusiness.id}`
      : `http://localhost:8000/business/`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: businessData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowAddModal(false);
      setIsEditMode(false);
      setEditableBusiness(null);
      setBusinessName("");
      setBusinessEmail("");
      setBusinessPhoneNumber("");
      setBusinessAddress("");
      setBusinessPostalCode("");
      fetchBusiness();
      window.location.reload();
    } catch (error) {
      console.error("Failed to add or update business:", error);
    }
  };

  // Component UI with form and table here, structured similarly to ProductsManager.jsx

  return (
    <div className="max-w-7xl h-screen">
      <div className="max-h-[500px] my-8 bg-white border shadow-md">
        {/* Delete modal start */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex overflow-auto bg-gray-800 bg-opacity-50">
            <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <p className="my-4">
                Are you sure you want to delete this business?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 text-black bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBusiness()}
                  className="px-4 py-2 text-white bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Delete modal end */}
        {/* Add Business start */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-50">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:w-1/2">
              <form
                className="px-4 py-6 sm:p-8"
                onSubmit={handleFormSubmit}
                noValidate
              >
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Supplier Name */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="business-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Business Name
                    </label>
                    <div className="mt-2">
                      <input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        type="text"
                        name="business-name"
                        id="business-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {businessNameError && (
                      <div className="text-red-600">
                        You must enter business name
                      </div>
                    )}
                  </div>

                  {/* Business Email */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="business-email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        type="email"
                        name="business-email"
                        id="business-email"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {businessEmailError && (
                      <div className="text-red-600">{businessEmailError}</div>
                    )}
                  </div>

                  {/* Business Phone Number */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="business-phone-number"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        value={businessPhoneNumber}
                        onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                        type="tel"
                        name="business-phone-number"
                        id="business-phone-number"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {businessPhoneNumberError && (
                      <div className="text-red-600">
                        {businessPhoneNumberError}
                      </div>
                    )}
                  </div>

                  {/* Business Address */}
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="business-address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address
                    </label>
                    <div className="mt-2">
                      <input
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        type="text"
                        name="business-address"
                        id="business-address"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {businessAddressError && (
                      <div className="text-red-600">{businessAddressError}</div>
                    )}
                  </div>

                  {/* Business Postal code */}

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Postal Code
                    </label>
                    <div className="mt-2">
                      <input
                        value={businessPostalCode}
                        onChange={(e) => setBusinessPostalCode(e.target.value)}
                        name="postal-code"
                        id="postal-code"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      ></input>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-end px-4 py-4 gap-x-6 border-gray-900/10 sm:px-8">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isEditMode ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Add business end */}

        {/* Business table */}
        <div className="p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <p className="mt-2 text-sm text-gray-700">
                List of businesses for{" "}
                <span className="text-x font-semibold ">
                  {ownerInfo.first_name} {ownerInfo.last_name}
                </span>
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={() => {
                  setEditableBusiness();
                  setIsEditMode(false);
                  setShowAddModal(true);
                }}
                type="button"
                className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Business
              </button>
            </div>
          </div>
          <div className="flow-root mt-8 h-[400px] overflow-y-auto overflow-x-hidden">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Business Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Phone number
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Postal Code
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        <span className="sr-only">Change</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {business.map((business) => (
                      <tr key={business.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {business.name}
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {business.email}
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {business.phone_number}
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {business.address}
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                          {business.postal_code}
                        </td>

                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                          <button
                            onClick={() => handleEditClick(business)}
                            className="text-black hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only"></span>
                          </button>
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                          <button
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setSelectedBusinessId(business.id);
                            }}
                            className="ml-8 text-red-700 hover:text-red-900 mr-6"
                          >
                            Delete
                            <span className="sr-only"></span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessManager;
