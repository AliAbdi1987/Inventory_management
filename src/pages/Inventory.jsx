import React from "react";
import InventorySideBar from '../components/InventorySideBar';
import {useContext, useEffect, useState} from "react";
import BusinessContext from '../contexts/BusinessContext';
// import UnitsManager from "../components/UnitsManager";
import InventoryManager from "../components/InventoryManager.jsx";
import InventoryThresholdChart from "../components/InventoryThresholdChart.jsx";


const Inventory = () => {
    const {currentBusiness} = useContext(BusinessContext);
    const [inventories, setInventories] = useState([]);

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

    async function fetchInventories() {
        try {
            const response = await fetch(`http://localhost:8000/business/${businessId}/inventories`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to fetch inventories.");
            }
            setInventories(data);
        } catch (error) {
            console.error("Error fetching inventories:", error.message);
        }
    }

    useEffect(() => {
            fetchInventories()
        }, [currentBusiness]);

    useEffect(() => {
        console.log("current_business",currentBusiness);
    }, [currentBusiness]);


    return (
        <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full '>
            <div className='w-full lg:w-1/4'>
                <InventorySideBar/>
            </div>
            <div className="flex flex-col md:ml-0 md:mr-8 justify-center items-center w-full">
                <div className='w-full justify-center items-center'>
                    <InventoryManager inventories={inventories} fetchInventories={fetchInventories}/>
                </div>
                <div className="w-full ml-3 justify-center items-center">
                    <InventoryThresholdChart inventories={inventories}/>
                </div>
            </div>
        </div>

    );
};

export default Inventory;
