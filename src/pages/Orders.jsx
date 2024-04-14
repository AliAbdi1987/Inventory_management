import React,{useContext, useEffect, useState} from "react";
import BusinessContext from '../contexts/BusinessContext';
import SalesSideBar from "../components/OrdersSideBar.jsx";
// import FileUpload from "../components/OrdersFileUpload.jsx";
import OrdersManager from "../components/OrdersManager.jsx";


const Orders = () => {

    const {currentBusiness} = useContext(BusinessContext);
    const [orders, setOrders] = useState([]);

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

    async function fetchOrders() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/purchase_orders`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to fetch orders.");
            }
            setOrders(data);
            // console.log(data);
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        }
    }

    useEffect(() => {
            fetchOrders()
        }, [currentBusiness]);


    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);


    return (
            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full'>
                <div className='w-full lg:w-1/4'>
                    <SalesSideBar/>
                </div>
                <div className=" flex flex-col md:ml-0 md:mr-8 justify-center items-center w-full ">
                    <div className='w-full justify-center items-center'>
                        {/* <FileUpload/> */}
                    </div>
                    <div className='w-full  justify-center items-center'>
                        <OrdersManager orders={orders} setOrders={setOrders} fetchOrders={fetchOrders}/>
                    </div>
                </div>

            </div>
    );
};

export default Orders;
