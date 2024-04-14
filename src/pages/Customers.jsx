import React,{useContext, useEffect} from "react";
import BusinessContext from '../contexts/BusinessContext';
import CustomersSideBar from "../components/CustomersSideBar";
import CustomersManager from "../components/CustomersManager";


const Products = () => {

    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);



    return (

            <div className='flex flex-row my-10 justify-center w-full '>
                <div className='w-full lg:w-1/4'>
                    <CustomersSideBar/>
                </div>

            <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                <CustomersManager/>
            </div>

        </div>
    );
};

export default Products;
