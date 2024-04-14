import React,{useContext, useEffect} from "react";
import BusinessContext from '../contexts/BusinessContext';
import SalesSideBar from "../components/SalesSideBar";
import FileUpload from "../components/SalesFileUpload.jsx";
// import SalesManager from "../components/SalesManager";
import DailySalesChart from "../components/DailySalesChart";


const Sales = () => {

    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);

    const businessName = currentBusiness ? currentBusiness.name : "Business";
    const businessId = currentBusiness ? currentBusiness.id : "ID";

    return (
            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full '>
                <div className='w-full md:w-1/4'>
                    <SalesSideBar/>
                </div>
                <div className=" flex flex-col justify-center items-center w-full ">
                    <div className='w-full ml-3 justify-center items-center'>
                        <FileUpload/>
                    </div>

                    <div className='w-full ml-3 justify-center items-center'>
                        <DailySalesChart/>
                    </div>
                </div>

            </div>
    );
};

export default Sales;
