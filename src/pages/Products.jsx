import React,{useContext, useEffect} from "react";
import ProductsSideBar from '../components/ProductsSideBar';
import BusinessContext from '../contexts/BusinessContext';
import ProductsManager from "../components/ProductsManager";


const Products = () => {

    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);

    const businessName = currentBusiness ? currentBusiness.name : "Business";
    const businessId = currentBusiness ? currentBusiness.id : "ID";

    return (
            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full'>
                <div className='w-full lg:w-1/4'>
                    <ProductsSideBar/>
                </div>
                <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                    <ProductsManager/>
                </div>

            </div>
    );
};

export default Products;
