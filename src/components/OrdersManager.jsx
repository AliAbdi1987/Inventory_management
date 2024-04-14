import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

function OrdersManager({ orders,setOrders, fetchOrders }) {
  const { currentBusiness } = useContext(BusinessContext);
  const [units, setUnits] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId ] = useState(null);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderNameError, setOrderNameError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderNumberError, setOrderNumberError] = useState("");
  const [orderSize, setOrderSize] = useState("");
  const [orderSizeError, setOrderSizeError] = useState("");
  const [orderItemType, setOrderItemType] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
//   const [orderMaximumAmount, setOrderMaximumAmount] = useState("");
//   const [orderMaximumAmountError, setOrderMaximumAmountError] = useState("");
//   const [orderThreshold, setOrderThreshold] = useState("");
//   const [orderThresholdError, setOrderThresholdError] = useState("");
  const [orderPricePerUnit, setOrderPricePerUnit] = useState("");
  const [orderPricePerUnitError, setOrderPricePerUnitError] = useState("");
  const [orderTimeOfDeliveryDays, setOrderTimeOfDeliveryDays] = useState("");
  const [orderTimeOfDeliveryDaysError, setOrderTimeOfDeliveryDaysError] = useState("");
  const [orderUnitId, setOrderUnitId] = useState("");
  const [orderUnitIdError, setOrderUnitIdError] = useState("");
  const [orderSupplierId, setOrderSupplierId] = useState("");
  const [orderSupplierIdError, setOrderSupplierIdError] = useState("");
  const [orderDateCreated, setOrderDateCreated] = useState("");
  const [orderDateCreatedError, setOrderDateCreatedError] = useState("");


  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableOrder, setEditableOrder] = useState(null);

  // Delivery status
  const [showDeliveryConfirmationModal, setShowDeliveryConfirmationModal] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);

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
        // console.log(data2);

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
    //   console.log(data3);

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


  function deleteOrderFromState(orderId) {
    const newOrders = orders.filter((order) => order.id !== orderId);
    // setInventories(newInventories);
  }

  async function deleteOrder() {
    if (selectedOrderId == null) {
        console.error("No order ID is set for deletion");
        return;
    }
    try {
      const response = await fetch(`http://localhost:8000/purchase_order/${selectedOrderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteOrderFromState(selectedOrderId);
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
        setDeleteModalOpen(false);
        setSelectedOrderId(null);
    }
  }

  function validateForm() {
    let isValid = true;
    setOrderNameError("");
    setOrderNumberError("");
    setOrderSizeError("");
    setOrderPricePerUnitError("");
    setOrderTimeOfDeliveryDaysError("");
    setOrderUnitIdError("");
    setOrderSupplierIdError("");
    setOrderDateCreatedError("");



    if (!orderName.trim()) {
      setOrderNameError("Order name is required");
      isValid = false;
    }

    if (orderNumber === null || orderNumber === undefined || orderNumber === "") {
        setOrderNumber("Order number is required");
        isValid = false;
    }

    if (orderNumber < 0) {
        setOrderNumberError("Order number cannot be negative");
        isValid = false;
    }

    if (orderSize === null || orderSize === undefined || orderSize === "") {
        setOrderSizeError("Order size is required");
        isValid = false;
    }

    if (orderSize < 0) {
        setOrderSizeError("Order size cannot be negative");
        isValid = false;
    }

    if (orderPricePerUnit === null || orderPricePerUnit === undefined || orderPricePerUnit === "") {
        setOrderPricePerUnitError("Price per unit is required");
        isValid = false;
    }

    if (orderPricePerUnit < 0) {
        setOrderPricePerUnitError("Price per unit cannot be negative");
        isValid = false;
    }

    if (orderTimeOfDeliveryDays === null || orderTimeOfDeliveryDays === undefined || orderTimeOfDeliveryDays === "") {
        setOrderTimeOfDeliveryDaysError("Time of delivery days is required");
        isValid = false;
    }

    if (orderTimeOfDeliveryDays <= 0) {
        setOrderTimeOfDeliveryDaysError("Time of delivery days cannot be negative or zero");
        isValid = false;
    }

    if (orderUnitId === null || orderUnitId === undefined || orderUnitId === "") {
        setOrderUnitIdError("Unit is required");
        isValid = false;
    }

    if (orderSupplierId === null || orderSupplierId === undefined || orderSupplierId === "") {
        setOrderSupplierIdError("Supplier is required");
        isValid = false;
    }

    if (orderDateCreated === null || orderDateCreated === undefined || orderDateCreated === "") {
        setOrderDateCreatedError("Date created is required");
        isValid = false;
    }


    return isValid;
    }

  const handleEditClick = (order) => {
    setIsEditMode(true);
    setEditableOrder(order);
    setShowAddModal(true);
    setOrderName(order.name);
    setOrderNumber(order.number);
    setOrderSize(order.size);
    setOrderItemType(order.item_type);
    setOrderDescription(order.description);
    setOrderPricePerUnit(order.price_per_unit);
    setOrderTimeOfDeliveryDays(order.time_of_delivery_days);
    setOrderUnitId(order.unit_id);
    setOrderSupplierId(order.supplier_id);
    setOrderDateCreated(order.date_created);

  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const orderData = JSON.stringify({
        name: orderName,
        number: orderNumber,
        size: orderSize,
        item_type: orderItemType,
        total_amount: orderNumber * orderSize,
        description: orderDescription,
        price_per_unit: orderPricePerUnit,
        time_of_delivery_days: orderTimeOfDeliveryDays,
        unit_id: orderUnitId,
        supplier_id: orderSupplierId,
        date_created: orderDateCreated,
        business_id: businessId,
        delivery_status: false,
    
    });
    console.log(orderData);

    const url = isEditMode
      ? `http://localhost:8000/purchase_order/${editableOrder.id}`
      : `http://localhost:8000/business/${businessId}/purchase_order`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken()}`,
        },
        body: orderData,
      });

      if (!response.ok) {
        const data4 = await response.json();
        console.log(data4);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowAddModal(false);
      setIsEditMode(false);
      setEditableOrder(null);
      setOrderName("");
      setOrderNumber("");
      setOrderSize("");
      setOrderItemType("");
      setOrderDescription("");
      setOrderPricePerUnit("");
      setOrderTimeOfDeliveryDays("");
      setOrderUnitId("");
      setOrderSupplierId("");
      setOrderDateCreated("");
      fetchOrders();

  

    } catch (error) {
      console.error("Failed to add or update order:", error);
    }
  };

  function handleDeliveryStatusChange(order, isChecked) {
    if (!order.delivery_status) {
        setSelectedOrderForDelivery(order);
        setShowDeliveryConfirmationModal(isChecked);
    }
    }
    // console.log("selected order for delivery",selectedOrderForDelivery)

  const confirmDelivery = async () => {
    if (!selectedOrderForDelivery) return;

    const selectedSupplier = suppliers.find(supplier => supplier.name === selectedOrderForDelivery.supplier_name);
    const supplierId = selectedSupplier ? selectedSupplier.id : null;

    const selectedUnit = units.find(unit => unit.name === selectedOrderForDelivery.unit_name);
    const unitId = selectedUnit ? selectedUnit.id : null;

    
    const deliveredOrder = JSON.stringify({
        name: selectedOrderForDelivery.name,
        number: selectedOrderForDelivery.number,
        size: selectedOrderForDelivery.size,
        item_type: selectedOrderForDelivery.item_type,
        total_amount: selectedOrderForDelivery.total_amount,
        description: selectedOrderForDelivery.description,
        price_per_unit: selectedOrderForDelivery.price_per_unit,
        time_of_delivery_days: selectedOrderForDelivery.time_of_delivery_days,
        unit_id: unitId,
        supplier_id: supplierId,
        date_created: selectedOrderForDelivery.date_created,
        delivery_status: true,
        business_id: businessId,
    });

    // console.log("delivered order", deliveredOrder);

    try {
        const updateResponse = await fetch(`http://localhost:8000/purchase_order/${selectedOrderForDelivery.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken()}`,
            },
            body: deliveredOrder,
        });

        if (!updateResponse.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchResponse = await fetch(`http://localhost:8000/purchase_order/${selectedOrderForDelivery.id}`);
        if (!fetchResponse.ok) {
            throw new Error("HTTP error! status: ${fetchResponse.status}");
        }

        const updatedOrderDetail = await fetchResponse.json();
        // console.log("updated order", updatedOrderDetail);

        const inventoryOrder = JSON.stringify({
            name: updatedOrderDetail.name,
            number: updatedOrderDetail.number,
            size: updatedOrderDetail.size,
            item_type: updatedOrderDetail.item_type,
            total_amount: updatedOrderDetail.number * updatedOrderDetail.size,
            description: updatedOrderDetail.description,
            price_per_unit: updatedOrderDetail.price_per_unit,
            time_of_delivery_days: updatedOrderDetail.time_of_delivery_days,
            threshold: updatedOrderDetail.threshold,
            maximum_amount: updatedOrderDetail.maximum_amount,
            unit_id: updatedOrderDetail.unit_id,
            supplier_id: updatedOrderDetail.supplier_id,
            business_id: businessId,
        });

        console.log("inventory order", inventoryOrder);


        // Update or add inventory
        await fetch(`http://localhost:8000/inventory/update_or_add/${businessId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken()}`,
            },
            body: inventoryOrder,
        });
        
        

        const updatedOrders = orders.map(order =>
            order.id === selectedOrderForDelivery.id
                ? { ...order, ...updatedOrderDetail, delivery_status: true}
                : order
        );

        setOrders(updatedOrders);
        setShowDeliveryConfirmationModal(false);
    } catch (error) {
        console.error("Failed to confirm delivery:", error);    
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
                    <p className="my-4">Are you sure you want to delete this material?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="px-4 py-2 text-black bg-gray-200 rounded"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => deleteOrder()}
                        className="px-4 py-2 text-white bg-red-600 rounded"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
            )}
            {/* Delete modal end */}

            {/* Delivery confirmation modal start */}
            {showDeliveryConfirmationModal && (
                <div className="fixed inset-0 z-50 flex overflow-auto bg-gray-800 bg-opacity-50">
                    <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold">Confirm Delivery</h2>
                        <p className="my-4">Are you sure you want to confirm delivery of this order?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeliveryConfirmationModal(false)}
                                className="px-4 py-2 text-black bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log(selectedOrderForDelivery); 
                                    confirmDelivery();
                                }}
                                className="px-4 py-2 text-white bg-green-600 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delivery confirmation modal end */}


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
                        
                        {/* Material Name */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="supplier-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Name
                            </label>
                            <div className="mt-1">
                                <input
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                    type="text"
                                    name="order-name"
                                    id="order-name"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {orderNameError && <div className="text-red-600">You must enter material name</div>}
                        </div>

                        {/* Inventory  Number */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-number"
                                className="block text-sm font-medium leading-6 text-gray-900"   
                            >
                                Material Number
                            </label>
                            <div className="mt-2">
                                <input
                                    value={orderNumber} 
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    type="number"
                                    name="order-number"
                                    id="order-number"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {orderNumberError && <div className="text-red-600">{orderNumberError}</div>}
                        </div>

                        {/* Inventory Size */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-size"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Size
                            </label>
                            <div className="mt-2">
                                <input
                                    value={orderSize}
                                    onChange={(e) => setOrderSize(e.target.value)}
                                    type="number"
                                    name="order-size"
                                    id="order-size"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {orderSizeError && <div className="text-red-600">{orderSizeError}</div>}
                        </div>

                        {/* Order Item Type */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-item-type"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Material Type
                            </label>
                            <div className="mt-2">
                                <input
                                    value={orderItemType}
                                    onChange={(e) => setOrderItemType(e.target.value)}
                                    type="text"
                                    name="order-item-type"
                                    id="order-item-type"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                        </div>

                        {/* Order Price Per Unit */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-price-per-unit"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Price Per Unit
                            </label>
                            <div className="mt-2">
                                <input
                                    value={orderPricePerUnit}
                                    onChange={(e) => setOrderPricePerUnit(e.target.value)}
                                    type="number"
                                    name="order-price-per-unit"
                                    id="order-price-per-unit"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {orderPricePerUnitError && <div className="text-red-600">{orderPricePerUnitError}</div>}
                        </div>

                        {/* Order Time of Delivery Days */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-time-of-delivery-days"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Time of Delivery Days
                            </label>
                            <div className="mt-2">
                                <input
                                    value={orderTimeOfDeliveryDays}
                                    onChange={(e) => setOrderTimeOfDeliveryDays(e.target.value)}
                                    type="number"
                                    name="order-time-of-delivery-days"
                                    id="order-time-of-delivery-days"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                            </div>
                            {orderTimeOfDeliveryDaysError && <div className="text-red-600">{orderTimeOfDeliveryDaysError}</div>}
                        </div>
                        
                        {/* Order Unit */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-unit"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Unit
                            </label>
                            <div className="mt-2">
                                <select
                                    value={orderUnitId}
                                    onChange={(e) => setOrderUnitId(e.target.value)}
                                    name="order-unit"
                                    id="order-unit"
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
                            {orderUnitIdError && <div className="text-red-600">You must select a unit</div>}
                        </div>

                        {/* Order Supplier */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="order-supplier"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Supplier
                            </label>
                            <div className="mt-2">
                                <select
                                    value={orderSupplierId}
                                    onChange={(e) => setOrderSupplierId(e.target.value)}
                                    name="order-supplier"
                                    id="order-supplier"
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
                            {orderSupplierIdError && <div className="text-red-600">You must select a supplier</div>}
                        </div>
                        {/* Order created date */}
                        <div className="sm:col-span-6">
                            <label
                                htmlFor="order-date-created"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Date Created
                            </label>
                            <div className="mt-2">
                                <input
                                    type="date"
                                    id="order-date-created"
                                    value={orderDateCreated}
                                    onChange={(e) => setOrderDateCreated(e.target.value)}
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                            {orderDateCreatedError && <div className="text-red-600">You must enter a valid date of hire</div>}
                        </div>

                      
                        {/* Order Description */}
                        <div className="sm:col-span-6">
                            <label
                                htmlFor="order-description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    value={orderDescription}
                                    onChange={(e) => setOrderDescription(e.target.value)}
                                    name="order-description"
                                    id="order-description"
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
            {/* Add order end */}

            {/* Order Table */}
            <div className="p-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p className="mt-2 text-sm text-gray-700">
                            List of Materials which ordered for <span className="text-x font-semibold ">{businessName}  </span>
                        business
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() =>{
                                setEditableOrder
                                setIsEditMode(false);
                                setShowAddModal(true)
                            }}
                            type="button"
                            className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add Orders
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
                                            className="py-3.5 pl-2 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                        >
                                            Material Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Total Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Price Per Unit
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Time of Delivery Days
                                        </th>
                                      
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Supplier
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Ordered date
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            Delivery Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3.5 pr-1 text-left text-sm font-semibold text-gray-900"
                                        >
                                            <span className="sr-only">Change</span>
                                        </th>
                                    </tr>
                                </thead>
    
                                <tbody className="divide-y divide-gray-300">
                                    {orders.map((order) => (
                                        <tr key={order.id}>  
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.name}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.total_amount}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.unit_name}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.price_per_unit}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.time_of_delivery_days}
                                            </td>
                                            
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.supplier_name}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                {order.date_created}
                                            </td>
                                            <td className="py-4 pl-1 pr-1 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">

                                                <input 
                                                    id="default-checkbox"
                                                    type="checkbox" 
                                                    checked={order.delivery_status}
                                                    disabled={order.delivery_status}
                                                    value="" 
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    onChange={(e) => handleDeliveryStatusChange(order, e.target.checked)}
                                                    />
                                                <label 
                                                    htmlFor="default-checkbox" 
                                                    className="ms-1 pr-3 text-sm font-medium text-gray-900 dark:text-gray-900">
                                                        Delivered
                                                </label>
                                                    {/* </div>
                                                </div> */}

                                            </td>
                                            <td className="relative py-4 pl-1 pr-1 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => handleEditClick(order)}
                                                    disabled={order.delivery_status}
                                                    className={`text-black hover:text-indigo-400 ${order.delivery_status ? "cursor-not-allowed" : ""}`}
                                                >
                                                    Edit
                                                    <span className="sr-only"></span>
                                                </button>
                                            </td>
                                            <td className="relative py-4 pl-1 pr-1 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                <button
                                                    onClick={() => {
                                                        setDeleteModalOpen(true);
                                                        setSelectedOrderId(order.id);
                                                    }}
                                                    disabled={order.delivery_status}
                                                    className={`ml-8 text-red-500 hover:text-red-900 mr-6 ${order.delivery_status ? "cursor-not-allowed" : ""}`}
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

export default OrdersManager;

