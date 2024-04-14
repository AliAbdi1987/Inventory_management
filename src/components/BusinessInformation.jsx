import React, { useContext, useEffect, useState } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

const BusinessInformation = () => {
    const { currentBusiness } = useContext(BusinessContext);
    const [numberOfEmployees, setNumberOfEmployees] = useState(0);
    const [numberOfCustomers, setNumberOfCustomers] = useState(0);
    const [numberOfSuppliers, setNumberOfSuppliers] = useState(0);
    const [numberOfInventories, setNumberOfInventories] = useState(0);
    const [numberOfProducts, setNumberOfProducts] = useState(0);
    const [numberOfDeliveredOrders, setNumberOfDeliveredOrders] = useState(0);
    const [numberOfUndeliveredOrders, setNumberOfUndeliveredOrders] = useState(0);
    const [numberOfOrders, setNumberOfOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    
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

    async function fetchNumberOfEmployees() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/employee-count`);
            const data = await response.json();
            console.log("Number of employees: ", data);

            if (!response.ok) {
                throw new Error("Failed to fetch number of employees");
            }
            setNumberOfEmployees(data.employee_count);
        } catch (error) {
            console.error("Error fetching number of employees: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfEmployees();
    }, []);

    async function fetchNumberOfCustomers() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/customer-count`);
            const data2 = await response.json();
            console.log("Number of customers: ", data2);

            if (!response.ok) {
                throw new Error("Failed to fetch number of customers");
            }
            setNumberOfCustomers(data2.customer_count);
        }
        catch (error) {
            console.error("Error fetching number of customers: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfCustomers();
    }, []);

    async function fetchNumberOfSuppliers() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/supplier-count`);
            const data3 = await response.json();
            console.log("Number of suppliers: ", data3);

            if (!response.ok) {
                throw new Error("Failed to fetch number of suppliers");
            }
            setNumberOfSuppliers(data3.supplier_count);
        }
        catch (error) {
            console.error("Error fetching number of suppliers: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfSuppliers();
    }, []);

    async function fetchNumberOfInventories() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/inventory-count`);
            const data4 = await response.json();
            console.log("Number of inventories: ", data4);

            if (!response.ok) {
                throw new Error("Failed to fetch number of inventories");
            }
            setNumberOfInventories(data4.inventory_count);
        }
        catch (error) {
            console.error("Error fetching number of inventories: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfInventories();
    }, []);

    async function fetchNumberOfProducts() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/product-count`);
            const data5 = await response.json();
            console.log("Number of products: ", data5);

            if (!response.ok) {
                throw new Error("Failed to fetch number of products");
            }
            setNumberOfProducts(data5.product_count);
        }
        catch (error) {
            console.error("Error fetching number of products: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfProducts();
    }, []);


    async function fetchNumberOfDelieredOrders() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/delivered-orders-count`);
            const data6 = await response.json();
            console.log("Number of delivered orders: ", data6);

            if (!response.ok) {
                throw new Error("Failed to fetch number of delivered orders");
            }
            setNumberOfDeliveredOrders(data6.delivered_orders_count);
        }
        catch (error) {
            console.error("Error fetching number of delivered orders: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfDelieredOrders();
    }, []);

    async function fetchNumberOfUndeliveredOrders() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/undelivered-orders-count`);
            const data7 = await response.json();
            console.log("Number of undelivered orders: ", data7);

            if (!response.ok) {
                throw new Error("Failed to fetch number of undelivered orders");
            }
            setNumberOfUndeliveredOrders(data7.undelivered_orders_count);
        }
        catch (error) {
            console.error("Error fetching number of undelivered orders: ", error);
        }
    }
    useEffect(() => {
        fetchNumberOfUndeliveredOrders();
    }, []);

    async function fetchNumberOfOrders() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/orders-count`);
            const data8 = await response.json();
            console.log("Number of orders: ", data8);

            if (!response.ok) {
                throw new Error("Failed to fetch number of orders");
            }
            setNumberOfOrders(data8.orders_count);
        }
        catch (error) {
            console.error("Error fetching number of orders: ", error);
        }
    }

    useEffect(() => {
        fetchNumberOfOrders();
    }, []);

    async function fetchTotalSales() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/total-sales`);
            const data9 = await response.json();
            console.log("Total sales: ", data9);

            if (!response.ok) {
                throw new Error("Failed to fetch total sales");
            }
            setTotalSales(data9.total_sales);
        } catch (error) {
            console.error("Error fetching total sales: ", error);
        }
    }

    useEffect(() => {
        fetchTotalSales();
    }, []);

    return (
        <div className='flex flex-row my-4 '>
            <div className='w-full '>
                <p className='text-4xl text-center  font-semibold'>Welcome to {businessName}</p>
                <div className='grid grid-cols-1 sm:grid-cols-3 items-center justify-center gap-16 mr-12 mt-20'>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>
                        <h2 className='text-3xl text-center font-semibold'>Employees <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfEmployees}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>
                        <h2 className='text-3xl text-center font-semibold'>Customers <br /><br /></h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfCustomers}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                     
                        <h2 className='text-3xl text-center font-semibold'>Suppliers <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfSuppliers}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>
                        <h2 className='text-2xl text-center font-semibold'>Unique materials in stock <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfInventories}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                       
                        <h2 className='text-3xl text-center font-semibold'>Products <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfProducts}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                       
                        <h2 className='text-3xl text-center font-semibold'>Orders <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfOrders}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                       
                        <h2 className='text-3xl text-center font-semibold'>Delivered orders <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfDeliveredOrders}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                       
                        <h2 className='text-3xl text-center font-semibold'>Undelivered orders <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{numberOfUndeliveredOrders}</p>
                    </div>
                    <div className='bg-gray-200 p-4 gap-x-6 gap-y-4 rounded-md'>                       
                        <h2 className='text-3xl text-center font-semibold'>Total sales <br /><br /> </h2>
                        <p className='text-2xl text-center font-semibold'>{totalSales}</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default BusinessInformation;