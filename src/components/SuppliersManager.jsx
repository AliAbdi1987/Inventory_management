import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

function SuppliersManager() {
  const { currentBusiness } = useContext(BusinessContext);
  const [suppliers, setSuppliers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierNameError, setSupplierNameError] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierEmailError, setSupplierEmailError] = useState("");
  const [supplierPhoneNumber, setSupplierPhoneNumber] = useState("");
  const [supplierPhoneNumberError, setSupplierPhoneNumberError] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [supplierAddressError, setSupplierAddressError] = useState("");
  const [supplierDescription, setSupplierDescription] = useState("");

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableSupplier, setEditableSupplier] = useState(null);

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

  async function fetchSuppliers() {
    try {
      const response = await fetch(`http://localhost:8000/business/${businessId}/suppliers`);
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers.");
      }
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error.message);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  function deleteSupplierFromState(supplierId) {
    const newSuppliers = suppliers.filter((supplier) => supplier.id !== supplierId);
    setSuppliers(newSuppliers);
  }

  async function deleteSupplier() {
    if (selectedSupplierId == null) {
        console.error("No supplier ID is set for deletion");
        return;
    }
    try {
      const response = await fetch(`http://localhost:8000/supplier/${selectedSupplierId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteSupplierFromState(selectedSupplierId);
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    } finally {
        setDeleteModalOpen(false);
        setSelectedSupplierId(null);
    }
  }

  function validateForm() {
    let isValid = true;
    setSupplierNameError("");
    setSupplierEmailError("");
    setSupplierPhoneNumberError("");
    setSupplierAddressError("");

    if (!supplierName.trim()) {
      setSupplierNameError("Supplier name is required");
      isValid = false;
    }

    if (!supplierEmail.trim()) {
      setSupplierEmailError("Supplier email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(supplierEmail)) {
      setSupplierEmailError("Email address is invalid");
      isValid = false;
    }

    if (!supplierPhoneNumber.trim()) {
      setSupplierPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (!/^\+?(\d.*){3,}$/.test(supplierPhoneNumber)) {
      setSupplierPhoneNumberError("Phone number is invalid");
      isValid = false;
    }

    if (!supplierAddress.trim()) {
      setSupplierAddressError("Address is required");
      isValid = false;
    }

    return isValid;
  }

  const handleEditClick = (supplier) => {
    setIsEditMode(true);
    setEditableSupplier(supplier);
    setShowAddModal(true);
    setSupplierName(supplier.name);
    setSupplierEmail(supplier.email);
    setSupplierPhoneNumber(supplier.phone_number);
    setSupplierAddress(supplier.address);
    setSupplierDescription(supplier.description);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const supplierData = JSON.stringify({
      name: supplierName,
      email: supplierEmail,
      phone_number: supplierPhoneNumber,
      address: supplierAddress,
      description: supplierDescription,
      // business_id: businessId // Uncomment if the backend requires the business ID
    });

    const url = isEditMode
      ? `http://localhost:8000/supplier/${editableSupplier.id}`
      : `http://localhost:8000/business/${businessId}/supplier`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: supplierData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowAddModal(false);
      setIsEditMode(false);
      setEditableSupplier(null);
      setSupplierName("");
      setSupplierEmail("");
      setSupplierPhoneNumber("");
      setSupplierAddress("");
      setSupplierDescription("");
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to add or update supplier:", error);
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
                    <p className="my-4">Are you sure you want to delete this supplier?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="px-4 py-2 text-black bg-gray-200 rounded"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => deleteSupplier()}
                        className="px-4 py-2 text-white bg-red-600 rounded"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
            )}
            {/* Delete modal end */}
            {/* Add Supplier start */}
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
                            htmlFor="supplier-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Supplier Name
                        </label>
                        <div className="mt-2">
                            <input
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}
                                type="text"
                                name="supplier-name"
                                id="supplier-name"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {supplierNameError && <div className="text-red-600">You must enter supplier name</div>}
                        </div>
                       
                        {/* Supplier Email */}
                        <div className="sm:col-span-6">
                        <label 
                            htmlFor="supplier-email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                value={supplierEmail}
                                onChange={(e) => setSupplierEmail(e.target.value)}
                                type="email"
                                name="supplier-email"
                                id="supplier-email"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {supplierEmailError && <div className="text-red-600">{supplierEmailError}</div>}
                        </div>

                        {/* Supplier Phone Number */}
                        <div className="sm:col-span-6">
                        <label
                            htmlFor="supplier-phone-number"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Phone Number
                        </label>
                        <div className="mt-2">
                            <input
                                value={supplierPhoneNumber}
                                onChange={(e) => setSupplierPhoneNumber(e.target.value)}
                                type="tel"
                                name="supplier-phone-number"
                                id="supplier-phone-number"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {supplierPhoneNumberError && <div className="text-red-600">{supplierPhoneNumberError}</div>}
                        </div>

                        {/* Supplier Address */}
                        <div className="sm:col-span-6">
                        <label
                            htmlFor="supplier-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >   
                            Address
                        </label>
                        <div className="mt-2">
                            <input
                                value={supplierAddress}
                                onChange={(e) => setSupplierAddress(e.target.value)}
                                type="text"
                                name="supplier-address"
                                id="supplier-address"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                        </div>
                        {supplierAddressError && <div className="text-red-600">{supplierAddressError}</div>}
                        </div>

                        {/* Supplier Description */}

                        <div className="sm:col-span-6">
                        <label
                            htmlFor="product-description"
                            className="block text-sm font-medium leading-6 text-gray-900"  
                        >
                            Description
                            </label>
                        <div className="mt-2">
                            <textarea
                                value={supplierDescription}
                                onChange={(e) => setSupplierDescription(e.target.value)}
                                name="supplier-description"
                                id="supplier-description"
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                ></textarea>
                        </div>
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
            {/* Add supplier end */}
    
            <div className="p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p className="mt-2 text-sm text-gray-700">
                            List of suppliers for <span className="text-x font-semibold ">{businessName}</span>
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() =>{
                                setEditableSupplier
                                setIsEditMode(false);
                                setShowAddModal(true)
                            }}
                            type="button"
                            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Supplier
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
                                            Supplier Name
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
                                            Description
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
                                    {suppliers.map((supplier) => (
                                        <tr key={supplier.id}>  
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {supplier.name}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {supplier.email}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {supplier.phone_number}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {supplier.address}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {supplier.description}
                                            </td>
                                          
                                            <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => handleEditClick(supplier)}
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
                                                        setSelectedSupplierId(supplier.id);  
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

export default SuppliersManager;
