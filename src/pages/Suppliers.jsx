import React,{useContext, useEffect} from "react";
import BusinessContext from '../contexts/BusinessContext';
import SuppliersSideBar from "../components/SuppliersSideBar";
import SuppliersManager from "../components/SuppliersManager";


const Suppliers = () => {

    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);



    return (
        <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full '>
            <div className='w-full lg:w-1/4'>
                <SuppliersSideBar/>
            </div>
            <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                <SuppliersManager/>
            </div>

        </div>
);
};

export default Suppliers;
