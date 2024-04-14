import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

function CustomersManager() {
  const { currentBusiness } = useContext(BusinessContext);
  const [customers, setCustomers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerFirstNameError, setCustomerFirstNameError] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerLastNameError, setCustomerLastNameError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerEmailError, setCustomerEmailError] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerPhoneNumberError, setCustomerPhoneNumberError] = useState("");

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState(null);

  const fetchBusinessNameFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).name : "Business";
  };
  const businessName = fetchBusinessNameFromLocalStorage();

const fetchBusinessIdFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).id : "ID";
    };
    const businessId = fetchBusinessIdFromLocalStorage();

  async function fetchCustomers() {
    try {
      const response = await fetch(`http://localhost:8000/business/${businessId}/customers`);
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch customers.");
      }
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  function deleteCustomerFromState(customerId) {
    const newCustomers = customers.filter((customer) => customer.id !== customerId);
    setCustomers(newCustomers);
  }

  async function deleteCustomer() {
    if (selectedCustomerId == null) {
        console.error("No customer ID is set for deletion");
        return;
    }
    try {
      const response = await fetch(`http://localhost:8000/customer/${selectedCustomerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteCustomerFromState(selectedCustomerId);
    } catch (error) {
      console.error("Failed to delete customer:", error);
    } finally {
        setDeleteModalOpen(false);
        setSelectedCustomerId(null);
    }
  }

  function validateForm() {
    let isValid = true;
    setCustomerFirstNameError("");
    setCustomerLastNameError("");
    setCustomerEmailError("");
    setCustomerPhoneNumberError("");


    if (!customerFirstName.trim()) {
      setCustomerFirstNameError("Customer name is required");
      isValid = false;
    }

    if (!customerLastName.trim()) {
        setCustomerLastNameError("Customer name is required");
        isValid = false;
    }

    if (!customerEmail.trim()) {
      setCustomerEmailError("Customer email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      setCustomerEmail("Email address is invalid");
      isValid = false;
    }

    if (!customerPhoneNumber.trim()) {
      setCustomerPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (!/^\+?(\d.*){3,}$/.test(customerPhoneNumber)) {
      setCustomerPhoneNumberError("Phone number is invalid");
      isValid = false;
    }

    return isValid;
  }

  const handleEditClick = (customer) => {
    setIsEditMode(true);
    setEditableCustomer(customer);
    setShowAddModal(true);
    setCustomerFirstName(customer.first_name);
    setCustomerLastName(customer.last_name);
    setCustomerEmail(customer.email);
    setCustomerPhoneNumber(customer.phone_number);

  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const customerData = JSON.stringify({
        first_name: customerFirstName,
        last_name: customerLastName,
        email: customerEmail,
        phone_number: customerPhoneNumber,

    });

    const url = isEditMode
      ? `http://localhost:8000/customer/${editableCustomer.id}`
      : `http://localhost:8000/business/${businessId}/customer`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: customerData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowAddModal(false);
      setIsEditMode(false);
      setEditableCustomer(null);
      setCustomerFirstName("");
      setCustomerLastName("");
      setCustomerEmail("");
      setCustomerPhoneNumber("");
      fetchCustomers();
 
    } catch (error) {
      console.error("Failed to add or update customer:", error);
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
                    <p className="my-4">Are you sure you want to delete this customer?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="px-4 py-2 text-black bg-gray-200 rounded"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => deleteCustomer()}
                        className="px-4 py-2 text-white bg-red-600 rounded"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
            )}
            {/* Delete modal end */}
            {/* Add customer start */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-50">
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:w-1/2">
                    <form
                    className="px-4 py-6 sm:p-8"
                    onSubmit={handleFormSubmit}
                    noValidate
                    >
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        
                        {/* Customer first name */}
                        <div className="sm:col-span-6">
                        <label
                            htmlFor="customer-first-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Customer First name
                        </label>
                        <div className="mt-2">
                            <input
                                value={customerFirstName}
                                onChange={(e) => setCustomerFirstName(e.target.value)}
                                type="text"
                                name="customer-first-name"
                                id="customer-first-name"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {customerFirstNameError && <div className="text-red-600">You must enter customer first name</div>}
                        </div>

                        {/* Customer last name */}
                        <div className="sm:col-span-6">
                        <label
                            htmlFor="customer-last-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Customer Last name
                        </label>
                        <div className="mt-2">
                            <input
                                value={customerLastName}
                                onChange={(e) => setCustomerLastName(e.target.value)}
                                type="text"
                                name="customer-last-name"
                                id="customer-last-name"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {customerLastNameError && <div className="text-red-600">You must enter customer last name</div>}
                        </div>
                       
                        {/* Customer Email */}
                        <div className="sm:col-span-6">
                        <label 
                            htmlFor="customer-email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                type="email"
                                name="customer-email"
                                id="customer-email"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {customerEmailError && <div className="text-red-600">{customerEmailError}</div>}
                        </div>

                        {/* Customer Phone Number */}
                        <div className="sm:col-span-6">
                        <label
                            htmlFor="customer-phone-number"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Phone Number
                        </label>
                        <div className="mt-2">
                            <input
                                value={customerPhoneNumber}
                                onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                                type="tel"
                                name="customer-phone-number"
                                id="customer-phone-number"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {customerPhoneNumberError && <div className="text-red-600">{customerPhoneNumberError}</div>}
                        </div>

                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center justify-end px-4 py-4 gap-x-6 border-gray-900/10 sm:px-8">
                        <button
                            type="button"
                            className="px-2 py-1.5 text-sm font-semibold leading-6 text-white bg-gray-500 rounded-md hover:bg-black"
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
            {/* Add customer end */}
    
            <div className="p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p className="mt-2 text-sm text-gray-700">
                            List of customers for <span className="text-x font-semibold ">{businessName}</span>
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() =>{
                                setEditableCustomer
                                setIsEditMode(false);
                                setShowAddModal(true)
                            }}
                            type="button"
                            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Customer
                        </button>
                    </div>
                </div>
                <div className="flow-root mt-8 h-[400px] overflow-y-outo overflow-x-hidden">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Customer First name
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Customer Last name
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
                                                <span className="sr-only">Change</span>
                                        </th>
                                        </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {customers.map((customer) => (
                                        <tr key={customer.id}>  
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {customer.first_name}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {customer.last_name}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {customer.email}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {customer.phone_number}
                                            </td>                                                     
                                            <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => handleEditClick(customer)}
                                                    className="text-black hover:text-indigo-400"
                                                >
                                                    Edit
                                                    <span className="sr-only"></span>
                                                </button>
                                            </td>
                                            <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => {
                                                        setDeleteModalOpen(true);
                                                        setSelectedCustomerId(customer.id);  
                                                    }}
                                                    className="ml-8 text-red-500 hover:text-red-900 mr-6"
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

export default CustomersManager;
