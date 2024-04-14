import React, { useState, createContext } from 'react';
import BusinessDashboard from '../components/BusinessDashboard';
import BusinessManager from "../components/BusinessManager.jsx";

export const OwnerContext = createContext();

const MainDashboard = () => {
    // Preload ownerInfo from localStorage or set to default if not available
    const storedOwnerInfo = JSON.parse(localStorage.getItem("ownerData") || '{}');

    const [ownerInfo, setOwnerInfo] = useState(storedOwnerInfo);

    // Removed useEffect since we're setting the initial state directly

    return (
        <OwnerContext.Provider value={ownerInfo}>
            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full'>
                <div className='w-full md:w-1/4'>
                    <BusinessDashboard/>
                </div>
                <div className='w-full md:mx-4 justify-center items-center '>
                    <div className="flex flex-col justify-center items-center">

                        <p className='text-2xl font-semibold mb-4'>Welcome, {ownerInfo.first_name} {ownerInfo.last_name}</p>
                        
                    </div>
                    <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                        <BusinessManager/>
                    </div>
                </div>
            </div>
        </OwnerContext.Provider>
    );
};

export default MainDashboard;
