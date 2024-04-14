import React, {useState, useEffect, useContext} from "react";
import BusinessContext from '../contexts/BusinessContext';
import { fetchToken } from "../util/auth";

function RawMaterialsList({productId, onClose}) {
    const {currentBusiness} = useContext(BusinessContext);
    const [usageAmounts, setUsageAmounts] = useState([]);
    const [units, setUnits] = useState([]);
    const [products, setProducts] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUsageAmountId, setSelectedUsageAmountId] = useState(null);

    //form states
    const [showAddModal, setShowAddModal] = useState(false);
    const [usageAmountCount, setUsageAmountCount] = useState("");
    const [usageAmountCountError, setUsageAmountCountError] = useState("");
    const [inventoryId, setInventoryId] = useState("");
    const [inventoryIdError, setInventoryIdError] = useState("");
    const [selectedProductId, setProductId] = useState("");
    const [productIdError, setProductIdError] = useState("");
    const [unitId, setUnitId] = useState("");
    const [unitIdError, setUnitIdError] = useState("");

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableUsageAmount, setEditableUsageAmount] = useState(null);

    async function fetchUsageAmounts() {
        try {
            const response = await fetch(`http://localhost:8000/product_inventory/${productId}/product_inventories`);

            if (!response.ok) {
                throw new Error("Failed to fetch usage amounts");
            }

            const data = await response.json();
            // console.log(data);

            if (Array.isArray(data)) {
                setUsageAmounts(data);
            } else {
                throw new Error("Data is not an array");
            }
  
        } catch (error) {
            console.error("Error fetching usage amounts: ", error);
            setUsageAmounts([]);
        }
    }

    useEffect(() => {
        fetchUsageAmounts(productId);
    }, []);
    console.log(usageAmounts)

    async function fetchUnits() {
        try {
            const response = await fetch('http://localhost:8000/units');
            const data2 = await response.json();
            // console.log(data2);

            if (!response.ok) {
                throw new Error("Failed to fetch units");
            }
            setUnits(data2);
        } catch (error) {
            console.error("Error fetching units: ", error.message);
        }
    }

    useEffect(() => {
        fetchUnits();
    }, []);

    async function fetchProducts() {
        try {
            const response = await fetch(`http://localhost:8000/products/${currentBusiness.id}`);
            const data3 = await response.json();
            // console.log(data3);
            
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            setProducts(data3);
        }
        catch (error) {
            console.error("Error fetching products: ", error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchInventories() {
        try {
            const response = await fetch(`http://localhost:8000/business/${currentBusiness.id}/inventories`);
            const data4 = await response.json();
            // console.log(data4);

            if (!response.ok) {
                throw new Error("Failed to fetch inventories");
            }
            setInventories(data4);
        }
        catch (error) {
            console.error("Error fetching inventories: ", error.message);
        }
    }

    useEffect(() => {
        fetchInventories();
    }, []);

    function deleteUsageAmountFormState(usageAmountId) {
        const newUsageAmounts = usageAmounts.filter((usageAmount) => usageAmount.usage_amount_id !== usageAmountId);
        setUsageAmounts(newUsageAmounts);
    }
    
    async function deleteUsageAmount() {
        if (selectedUsageAmountId == null) {
            console.error("No usage amount selected");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/product_inventory/${selectedUsageAmountId}`, {
                method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete usage amount");
        }
        deleteUsageAmountFormState(selectedUsageAmountId);
        } catch (error) {
            console.error("Error deleting usage amount: ", error);
        } finally {
            setDeleteModalOpen(false);
            setSelectedUsageAmountId(null);
        }
    }

    function validateForm() {
        let isValid = true;
        setUsageAmountCountError("");
        setInventoryIdError("");
        setProductIdError("");
        setUnitIdError("");

        if (usageAmountCount === null || usageAmountCount === undefined || usageAmountCount === "") {
            setUsageAmountCountError("Usage amount count is required");
            isValid = false;
        }

        if (inventoryId === null || inventoryId === undefined || inventoryId === "") {
            setInventoryIdError("Inventory is required");
            isValid = false;
        }

        if (productId === null || productId === undefined || productId === "") {
            setProductIdError("Product is required");
            isValid = false;
        }

        if (unitId === null || unitId === undefined || unitId === "") {
            setUnitIdError("Unit is required");
            isValid = false;
        }

        return isValid;
    }

    const handleEditClick = (usageAmount) => {
        setIsEditMode(true);
        setEditableUsageAmount(usageAmount);
        setShowAddModal(true);
        setUsageAmountCount(usageAmount.usage_amount);
        setInventoryId(usageAmount.inventory_id);
        setProductId(usageAmount.product_id);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const usageAmountData = JSON.stringify({
           usage_amount: usageAmountCount,
           inventory_id: inventoryId,
           product_id: productId,
        });
    console.log(usageAmountData);

    console.log(editableUsageAmount);
    const url = isEditMode
    ?  `http://localhost:8000/product_inventory/${editableUsageAmount.usage_amount_id}`
    : 'http://localhost:8000/product_inventory';

    const method = isEditMode ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken()}`,
            },
            body: usageAmountData,
        });

        if (!response.ok) {
            const data5 = await response.json();
            console.log(data5);
            throw new Error(data5.message);
        }

        setShowAddModal(false);
        setIsEditMode(false);
        setEditableUsageAmount(null);
        setUsageAmountCount("");
        setInventoryId("");
        setProductId("");
        fetchUsageAmounts();

    } catch (error) {
        console.error("Error adding usage amount: ", error);
    }
};

return (
    <div className="max-w-7xl">
        <div className="max-h-[600px] my-2 bg-white border shadow-md">
            {/* Delete modal start */}
            {deleteModalOpen && (
                <div className="fixed z-50 inset-0 flex  overflow-auto bg-gray-500 bg-opacity-75">  
                    <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Confirm Delete</h2>
                            <p className="my-4">Are you sure you want to delete this usage amount?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 text-black bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteUsageAmount()}
                                    className="px-4 py-2 text-white bg-red-600 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                    </div>
                </div>
            )}
            {/* Delete modal end */}

            {/* Add usage amount start */}
            {showAddModal && (
                <div className="fixed z-20 inset-0 flex items-center justify-center overflow-auto bg-gray-100 bg-opacity-75">
                    <div className="bg-white shadow-sm ring-4 ring-gray-900/5 sm:rounded-2xl md:w-1/3 ">
                        <form 
                            onSubmit={handleFormSubmit}
                            className="px-4 py-4 sm:p-8"
                            noValidate
                        >
                        <div className="grid max-w-2xl grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-6">
                            {/*Inventory name */}
                            <div className="sm:col-span-6">
                                <label 
                                    htmlFor="inventory_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Inventory
                                </label>
                                <div className="mt-2">
                                    <select
                                        value={inventoryId}
                                        onChange={(e) => setInventoryId(e.target.value)}
                                        id="inventory_id"
                                        name="inventory_id"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value=""> Select Inventory</option>
                                        {inventories.map((inventory) => (
                                            <option key={inventory.id} value={inventory.id}>
                                                {inventory.name}
                                            </option>
                                        ))}
                                    </select>
                                    {inventoryIdError && (
                                        <p className="mt-2 text-sm text-red-600">{inventoryIdError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Usage amount count */}
                            <div className="sm:col-span-3">
                                <label 
                                    htmlFor="usage_amount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Usage Amount
                                </label>
                                <div className="mt-2">
                                    <input
                                        value={usageAmountCount}
                                        onChange={(e) => setUsageAmountCount(e.target.value)}
                                        type="number"
                                        id="usage_amount"
                                        name="usage_amount"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {usageAmountCountError && (
                                        <p className="mt-2 text-sm text-red-600">{usageAmountCountError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="sm:col-span-3">
                                <label 
                                    htmlFor="unit_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Unit
                                </label>
                                <div className="mt-2">
                                    <select
                                        value={unitId}
                                        onChange={(e) => setUnitId(e.target.value)}
                                        id="unit_id"
                                        name="unit_id"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    >
                                        <option value=""> Select Unit</option>
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                    {unitIdError && (
                                        <p className="mt-2 text-sm text-red-600">{unitIdError}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center justify-first px-4 py-4 gap-x-6 border-gray-900/10 sm:px-8">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-2 py-1.5 text-sm font-semibold leading-6 text-white bg-gray-500 rounded-md hover:bg-black"
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
                        </div>
                    </form>
                </div>
            </div>
        )}
        {/* Add usage amount end */}

        {/* Usage amount list start */}
        <div className="p-4">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex-auto">
                    <p className="mt-2 text-sm text-gray-700">
                        List of Materials in this product <span className="text-x font-semibold">{currentBusiness.name}</span>
                    </p>
                </div>
                <div className="mt-2 sm:ml-4 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => {
                            setEditableUsageAmount
                            setShowAddModal(true);
                            setIsEditMode(false);
                        }}
                        type="button"
                        className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add Material
                    </button>
                </div>
            </div>
        </div>
        <div className="flow-root mt-8 max-h-[500px] overflow-y-outo overflow-x-hidden">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">    
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                                >
                                    Inventory
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900"
                                >
                                    Usage Amount
                                </th>
                                <th
                                    scope="col"
                                    className="py-3.5 pr-3 text-center text-sm font-semibold text-gray-900"
                                >
                                    Unit
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {usageAmounts.map((usageAmount) => (
                                <tr key={usageAmount.inventory_id}>
                                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                        {usageAmount.inventory_name}
                                    </td>
                                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                        {usageAmount.usage_amount}
                                    </td>
                                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                        {usageAmount.unit_name}
                                    </td>
                                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-2">
                                        <button
                                            onClick={() => handleEditClick(usageAmount)}
                                            className="text-black hover:text-indigo-400"
                                        >
                                            Change
                                        </button>
                                    </td>
                                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUsageAmountId(usageAmount.usage_amount_id);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {/* Usage amount list end */}
    </div>
</div>
);
}

export default RawMaterialsList;

