// npm install @headlessui/react
// npm install daisyui
// npm install tw-elements-react
// npm install tw-elements

import { TEChart } from "tw-elements-react";
import React, { useState, useEffect, useContext } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";
import {OwnerContext} from "../pages/MainDashboard.jsx";


function InventoryThresholdChart({inventories}) {
    const { currentBusiness } = useContext(BusinessContext);
    
    const labels = inventories.map((inventory) => inventory.name);

    const data = inventories.map((inventory) => (inventory.total_amount/inventory.maximum_amount)*100);

    const backgroundColors = inventories.map(inventory => {
        const percentage = (inventory.total_amount / inventory.maximum_amount) * 100;
        const thresholdPercentage = inventory.threshold * 100;
        if (percentage < thresholdPercentage) {
            return 'red'; // Below threshold
        } else if (percentage >= thresholdPercentage && percentage <= (inventory.threshold + 0.1) * 100) {
            return "#FDDA0D"; // Within threshold and threshold + 10%
        } else {
            return "#50C878"; // Above threshold + 10%
        }
    });

    return (
        <div className="w-full sm:w-5/6 ml-16 mt-10 justify-center items-center">
            <TEChart
                type="bar" 
                data={{
                labels:labels,
                datasets: [
                    {
                    label: "warehouse inventory (in percentage)",
                    data: data,
                    barThickness: 20,
                        backgroundColor: backgroundColors,
                    },
                    
                ],
                
                }}
            
            />
        </div>
    );
    }

export default InventoryThresholdChart;
