import React,{useContext, useEffect} from "react";
import BusinessContext from '../contexts/BusinessContext';
import EmployeesSideBar from "../components/EmployeesSideBar";
import EmployeesManager from "../components/EmployeesManager";


const Employees = () => {

    const {currentBusiness} = useContext(BusinessContext);

    useEffect(() => {
        console.log(currentBusiness);
    }, [currentBusiness]);


    return (
            <div className='flex flex-col md:flex-row my-10 justify-center items-center w-full'>
                <div className='w-full lg:w-1/4'>
                    <EmployeesSideBar/>
                </div>
                <div className='w-full md:ml-0 md:mr-8 justify-center items-center'>
                    <EmployeesManager/>
                </div>
            </div>
    );
};

export default Employees;
