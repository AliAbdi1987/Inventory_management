import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

function InventoriesManager({ inventories, fetchInventories }) {
  const { currentBusiness } = useContext(BusinessContext);
//   const [inventories, setInventories] = useState([]);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId ] = useState(null);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventoryName, setInventoryName] = useState("");
  const [inventoryNameError, setInventoryNameError] = useState("");
  const [inventoryNumber, setInventoryNumber] = useState("");
  const [inventoryNumberError, setInventoryNumberError] = useState("");
  const [inventorySize, setInventorySize] = useState("");
  const [inventorySizeError, setInventorySizeError] = useState("");
  const [inventoryItemType, setInventoryItemType] = useState("");
  const [inventoryDescription, setInventoryDescription] = useState("");
  const [inventoryMaximumAmount, setInventoryMaximumAmount] = useState("");
  const [inventoryMaximumAmountError, setInventoryMaximumAmountError] = useState("");
  const [inventoryThreshold, setInventoryThreshold] = useState("");
  const [inventoryThresholdError, setInventoryThresholdError] = useState("");
  const [inventoryPricePerUnit, setInventoryPricePerUnit] = useState("");   
  const [inventoryPricePerUnitError, setInventoryPricePerUnitError] = useState("");
  const [inventoryTimeOfDeliveryDays, setInventoryTimeOfDeliveryDays] = useState("");
  const [inventoryTimeOfDeliveryDaysError, setInventoryTimeOfDeliveryDaysError] = useState("");
  const [inventoryUnitId, setInventoryUnitId] = useState("");
  const [inventoryUnitIdError, setInventoryUnitIdError] = useState("");
  const [inventorySupplierId, setInventorySupplierId] = useState("");
  const [inventorySupplierIdError, setInventorySupplierIdError] = useState("");


  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableInventory, setEditableInventory] = useState(null);

//   async function fetchInventories() {
//     try {
//       const response = await fetch(`http://localhost:8000/business/${currentBusiness.id}/inventories`);
//       const data = await response.json();
//       console.log(data);

//       if (!response.ok) {
//         throw new Error("Failed to fetch inventories.");
//       }
//       setInventories(data);
//     } catch (error) {
//       console.error("Error fetching inventories:", error.message);
//     }
//   }

//   useEffect(() => {
//     fetchInventories();
//   }, []);

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

  async function fetchUnits() {
    try {
        const response = await fetch('http://localhost:8000/units');
        const data2 = await response.json();
        console.log(data2);

        if (!response.ok) {
            throw new Error("Failed to fetch units.");
        }
        setUnits(data2);
    } catch (error) {
        console.error("Error fetching units:", error.message);
    }
}

useEffect(() => {
    fetchUnits();
    }, []);

  async function fetchSuppliers() {
    try {
      const response = await fetch(`http://localhost:8000/business/${businessId}/suppliers`);
      const data3 = await response.json();
      console.log(data3);

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers.");
      }
      setSuppliers(data3);
    } catch (error) {
      console.error("Error fetching suppliers:", error.message);
    }
  } 

  useEffect(() => {
    fetchSuppliers();
    }, []);


  function deleteInventoryFromState(inventoryId) {
    const newInventories = inventories.filter((inventory) => inventory.id !== inventoryId);
    // setInventories(newInventories);
  }

  async function deleteInventory() {
    if (selectedInventoryId == null) {
        console.error("No inventory ID is set for deletion");
        return;
    }
    try {
      const response = await fetch(`http://localhost:8000/inventory/${selectedInventoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteInventoryFromState(selectedInventoryId);
      fetchInventories();
    } catch (error) {
      console.error("Failed to delete inventory:", error);
    } finally {
        setDeleteModalOpen(false);
        setSelectInventoryId(null);
    }
  }

  function validateForm() {
    let isValid = true;
    setInventoryNameError("");
    setInventoryNumberError("");
    setInventorySizeError("");
    setInventoryMaximumAmountError("");
    setInventoryThresholdError("");
    setInventoryPricePerUnitError("");
    setInventoryTimeOfDeliveryDaysError("");
    setInventoryUnitIdError("");
    setInventorySupplierIdError("");


    if (!inventoryName.trim()) {
      setInventoryNameError("Inventory name is required");
      isValid = false;
    }

    if (inventoryNumber === null || inventoryNumber === undefined || inventoryNumber === "") {
        setInventoryNumberError("Inventory number is required");
        isValid = false;
    }

    if (inventoryNumber < 0) {
        setInventoryNumberError("Inventory number cannot be negative");
        isValid = false;
    }

    if (inventorySize === null || inventorySize === undefined || inventorySize === "") {
        setInventorySizeError("Inventory size is required");
        isValid = false;
    }

    if (inventorySize < 0) {
        setInventorySizeError("Inventory size cannot be negative");
        isValid = false;
    }


    if (inventoryMaximumAmount === null || inventoryMaximumAmount === undefined || inventoryMaximumAmount === "") {
        setInventoryMaximumAmountError("Maximum amount is required");
        isValid = false;
    }

    if (inventoryMaximumAmount < 0) {
        setInventoryMaximumAmountError("Maximum amount cannot be negative");
        isValid = false;
    }

    if (inventoryThreshold === null || inventoryThreshold === undefined || inventoryThreshold === "") {
        setInventoryThresholdError("Threshold is required");
        isValid = false;
    }

    if (inventoryThreshold < 0 || inventoryThreshold >= 1) {
        setInventoryThresholdError("Threshold cannot be negative or greater than 1");
        isValid = false;
    }

    if (inventoryPricePerUnit === null || inventoryPricePerUnit === undefined || inventoryPricePerUnit === "") {
        setInventoryPricePerUnitError("Price per unit is required");
        isValid = false;
    }

    if (inventoryPricePerUnit < 0) {
        setInventoryPricePerUnitError("Price per unit cannot be negative");
        isValid = false;
    }

    if (inventoryTimeOfDeliveryDays === null || inventoryTimeOfDeliveryDays === undefined || inventoryTimeOfDeliveryDays === "") {
        setInventoryTimeOfDeliveryDaysError("Time of delivery days is required");
        isValid = false;
    }

    if (inventoryTimeOfDeliveryDays <= 0) {
        setInventoryTimeOfDeliveryDaysError("Time of delivery days cannot be negative or zero");
        isValid = false;
    }

    if (inventoryUnitId === null || inventoryUnitId === undefined || inventoryUnitId === "") {
        setInventoryUnitIdError("Unit is required");
        isValid = false;
    }

    if (inventorySupplierId === null || inventorySupplierId === undefined || inventorySupplierId === "") {
        setInventorySupplierIdError("Supplier is required");
        isValid = false;
    }


    return isValid;
    }

  const handleEditClick = (inventory) => {
    setIsEditMode(true);
    setEditableInventory(inventory);
    setShowAddModal(true);
    setInventoryName(inventory.name);
    setInventoryNumber(inventory.number);
    setInventorySize(inventory.size);
    setInventoryItemType(inventory.item_type);
    setInventoryDescription(inventory.description);
    setInventoryMaximumAmount(inventory.maximum_amount);
    setInventoryThreshold(inventory.threshold);
    setInventoryPricePerUnit(inventory.price_per_unit);
    setInventoryTimeOfDeliveryDays(inventory.time_of_delivery_days);
    setInventoryUnitId(inventory.unit_id);
    setInventorySupplierId(inventory.supplier_id);

    
    // add unit id
    // add supplier id
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const inventoryData = JSON.stringify({
        name: inventoryName,
        number: inventoryNumber,
        size: inventorySize,
        item_type: inventoryItemType,
        total_amount: inventoryNumber * inventorySize,
        description: inventoryDescription,
        maximum_amount: inventoryMaximumAmount,
        threshold: inventoryThreshold,
        price_per_unit: inventoryPricePerUnit,
        time_of_delivery_days: inventoryTimeOfDeliveryDays,
        unit_id: inventoryUnitId,
        supplier_id: inventorySupplierId,

        // unit_id: inventoryUnitId, // unit id
        // supplier_id: inventorySupplierId, // supplier id
        business_id: businessId,
    
    });
    console.log(inventoryData);

    const url = isEditMode
      ? `http://localhost:8000/inventory/${editableInventory.id}`
      : `http://localhost:8000/business/${businessId}/inventory`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: inventoryData,
      });

      if (!response.ok) {
        const data4 = await response.json();
        console.log(data4);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowAddModal(false);
      setIsEditMode(false);
      setEditableInventory(null);
      setInventoryName("");
      setInventoryNumber("");
      setInventorySize("");
      setInventoryItemType("");
      setInventoryDescription("");
      setInventoryMaximumAmount("");
      setInventoryThreshold("");
      setInventoryPricePerUnit("");
      setInventoryTimeOfDeliveryDays("");
      setInventoryUnitId("");
      setInventorySupplierId("");
      fetchInventories();

    } catch (error) {
      console.error("Failed to add or update inventory:", error);
    }
  };

  // Component UI with form and table here, structured similarly to ProductsManager.jsx

  return (

        <div className="max-w-7xl">
          <div className="max-h-[400px] my-8 bg-white border shadow-md">
            {/* Delete modal start */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex overflow-auto bg-gray-800 bg-opacity-50">
                    <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Confirm Delete</h2>
                    <p className="my-4">Are you sure you want to delete this material?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="px-4 py-2 text-black bg-gray-200 rounded"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => deleteInventory()}
                        className="px-4 py-2 text-white bg-red-600 rounded"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
            )}
            {/* Delete modal end */}
            {/* Add inventory start */}
            {showAddModal && (
                <div className="fixed inset-0 z-30 flex items-center justify-center overflow-auto bg-gray-100 bg-opacity-90">
                    <div className="bg-white shadow-sm ring-4 ring-gray-900/5 sm:rounded-2xl md:w-1/3 ">
                    <form
                    className="px-4 py-4 sm:p-8"
                    onSubmit={handleFormSubmit}
                    noValidate
                    >
                    <div className="grid max-w-2xl grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-6">
                        
                        {/* Supplier Name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="supplier-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Name
                            </label>
                            <div className="mt-1">
                                <input
                                    value={inventoryName}
                                    onChange={(e) => setInventoryName(e.target.value)}
                                    type="text"
                                    name="inventory-name"
                                    id="inventory-name"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryNameError && <div className="text-red-600">You must enter material name</div>}
                        </div>

                        {/* Inventory  Number */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-number"
                                className="block text-sm font-medium leading-6 text-gray-900"   
                            >
                                Material Number
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryNumber} 
                                    onChange={(e) => setInventoryNumber(e.target.value)}
                                    type="number"
                                    name="inventory-number"
                                    id="inventory-number"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryNumberError && <div className="text-red-600">{inventoryNumberError}</div>}
                        </div>

                        {/* Inventory Size */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-size"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Size
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventorySize}
                                    onChange={(e) => setInventorySize(e.target.value)}
                                    type="number"
                                    name="inventory-size"
                                    id="inventory-size"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventorySizeError && <div className="text-red-600">{inventorySizeError}</div>}
                        </div>

                        {/* Inventory Item Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-item-type"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Type
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryItemType}
                                    onChange={(e) => setInventoryItemType(e.target.value)}
                                    type="text"
                                    name="inventory-item-type"
                                    id="inventory-item-type"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                        </div>

                        {/* Inventory Maximum Amount */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-maximum-amount"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Maximum Amount
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryMaximumAmount}
                                    onChange={(e) => setInventoryMaximumAmount(e.target.value)}
                                    type="number"
                                    name="inventory-maximum-amount"
                                    id="inventory-maximum-amount"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryMaximumAmountError && <div className="text-red-600">{inventoryMaximumAmountError}</div>}
                        </div>

                        {/* Inventory Threshold */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-threshold"
                                className="block text-sm font-medium leading-6 text-gray-900"   
                            >
                                Threshold
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryThreshold}
                                    onChange={(e) => setInventoryThreshold(e.target.value)}
                                    type="number"
                                    name="inventory-threshold"
                                    id="inventory-threshold"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryThresholdError && <div className="text-red-600">{inventoryThresholdError}</div>}
                        </div>

                        {/* Inventory Price Per Unit */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-price-per-unit"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Price Per Unit
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryPricePerUnit}
                                    onChange={(e) => setInventoryPricePerUnit(e.target.value)}
                                    type="number"
                                    name="inventory-price-per-unit"
                                    id="inventory-price-per-unit"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryPricePerUnitError && <div className="text-red-600">{inventoryPricePerUnitError}</div>}
                        </div>

                        {/* Inventory Time of Delivery Days */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-time-of-delivery-days"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Time of Delivery Days
                            </label>
                            <div className="mt-2">
                                <input
                                    value={inventoryTimeOfDeliveryDays}
                                    onChange={(e) => setInventoryTimeOfDeliveryDays(e.target.value)}
                                    type="number"
                                    name="inventory-time-of-delivery-days"
                                    id="inventory-time-of-delivery-days"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {inventoryTimeOfDeliveryDaysError && <div className="text-red-600">{inventoryTimeOfDeliveryDaysError}</div>}
                        </div>

                        {/* Inventory Unit */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-unit"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Unit
                            </label>
                            <div className="mt-2">
                                <select
                                    value={inventoryUnitId}
                                    onChange={(e) => setInventoryUnitId(e.target.value)}
                                    name="inventory-unit"
                                    id="inventory-unit"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select unit</option>   
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            {inventoryUnitIdError && <div className="text-red-600">{inventoryUnitIdError}</div>}
                        </div>

                        {/* Inventory Supplier */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="inventory-supplier"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Supplier
                            </label>
                            <div className="mt-2">
                                <select
                                    value={inventorySupplierId}
                                    onChange={(e) => setInventorySupplierId(e.target.value)}
                                    name="inventory-supplier"
                                    id="inventory-supplier"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                >
                                    <option value="">Select supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {inventorySupplierIdError && <div className="text-red-600">{inventorySupplierIdError}</div>}
                        </div>
                                                {/* Inventory Description */}
                                                <div className="sm:col-span-6">
                            <label
                                htmlFor="inventory-description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    value={inventoryDescription}
                                    onChange={(e) => setInventoryDescription(e.target.value)}
                                    name="inventory-description"
                                    id="inventory-description"
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
            {/* Add inventory end */}

            {/* Inventory Table */}
            <div className="p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p className="mt-2 text-sm text-gray-700">
                            List of Materials in stock for <span className="text-x font-semibold ">{businessName}</span>
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() =>{
                                setEditableInventory
                                setIsEditMode(false);
                                setShowAddModal(true)
                            }}
                            type="button"
                            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Material
                        </button>
                    </div>
                </div>
                <div className="flow-root mt-8 h-[300px] overflow-y-outo overflow-x-hidden">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Material Name
                                        </th>
                                        {/* <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Material Number
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Material Size
                                        </th> */}
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Material Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Total Amount
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
                                            Maximum Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Threshold
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Price Per Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Time of Delivery Days
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Supplier
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
                                    {inventories.map((inventory) => (
                                        <tr key={inventory.id}>  
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.name}
                                            </td>
                                            {/* <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.number}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.size}
                                            </td> */}
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.item_type}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.total_amount}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.description}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0"> 
                                                {inventory.maximum_amount}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.threshold}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.price_per_unit}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.time_of_delivery_days}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.unit_name}
                                            </td>
                                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {inventory.supplier_name}
                                            </td>
                                            <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => handleEditClick(inventory)}
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
                                                        setSelectedInventoryId(inventory.id);
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

export default InventoriesManager;

