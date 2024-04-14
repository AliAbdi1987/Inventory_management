// npm install @headlessui/react
// npm install daisyui
// npm install tw-elements-react
// npm install tw-elements

import { TEChart } from "tw-elements-react";
import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";
import {OwnerContext} from "../pages/MainDashboard.jsx";


function DailySalesChart() {
    const { currentBusiness } = useContext(BusinessContext);
    const [dailySales, setDailySales] = useState([]);

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

      async function fetchDailySales() {
    try {
        const response = await fetch(`http://localhost:8000/business/${businessId}/daily-sales`);
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error("Failed to fetch daily sales.");
        }
        setDailySales(data);
    }
    catch (error) {
        console.error("Error fetching daily sales:", error.message);
    }
}

    useEffect(() => {
        fetchDailySales();
    }
    , [currentBusiness]);


    const labels = dailySales.map((dailySale) => dailySale.sale_date);

    const data = dailySales.map((dailySale) => dailySale.total_sales);


    return (
        <div className="w-full sm:w-5/6 ml-16 mt-10 justify-center items-center ">
            <TEChart
                type="bar" 
                data={{
                labels:labels,
                datasets: [
                    {
                    label: "Daily Sales (SEK)",
                    data: data,
                    barThickness: 20,
                        backgroundColor: "#50C878",
                    },
                    
                ],
                
                }}
            
            />
        </div>
    );
    }

export default DailySalesChart;
