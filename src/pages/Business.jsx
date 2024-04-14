import BusinessSideBar from '../components/BusinessSideBar';
import React,{useContext, useEffect} from "react";
import BusinessContext from '../contexts/BusinessContext';
import BusinessInformation from '../components/BusinessInformation';



const Business = () => {
    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);
    
    const fetchBusinessInfo = () => {
    localStorage.getItem("businessInfo");
    }

    const fetchBusinessNameFromLocalStorage = () => {
        const businessInfo = localStorage.getItem("businessInfo");
        return businessInfo ? JSON.parse(businessInfo).name : "Business";
      };
    const businessName = fetchBusinessNameFromLocalStorage();

    const deleteBusinessInfo = () => {
        localStorage.removeItem("businessInfo");
    }

    return (

            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full '>
                <div className='w-full lg:w-1/4'>
                    <BusinessSideBar fetchBusinessInfo={fetchBusinessInfo} deleteBusinessInfo={deleteBusinessInfo} />
                </div>
                <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                    <BusinessInformation/>
                    
                </div>

            </div>
    );
};

export default Business;
