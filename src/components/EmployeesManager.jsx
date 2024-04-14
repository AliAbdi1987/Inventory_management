import React, { useContext, useEffect, useState } from "react";
import BusinessContext from "../contexts/BusinessContext";
import { fetchToken } from "../util/auth";

function EmployeesManager() {
    const { currentBusiness } = useContext(BusinessContext);
    const [employees, setEmployees] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    // form states
    const [showAddModal, setShowAddModal] = useState(false);
    const [employeeFirstName, setEmployeeFirstName] = useState("");
    const [employeeFirstNameError, setEmployeeFirstNameError] = useState("");
    const [employeeLastName, setEmployeeLastName] = useState("");
    const [employeeLastNameError, setEmployeeLastNameError] = useState("");
    const [employeePhoneNumber, setEmployeePhoneNumber] = useState("");
    const [employeePhoneNumberError, setEmployeePhoneNumberError] = useState("");
    const [employeeEmail, setEmployeeEmail] = useState("");
    const [employeeEmailError, setEmployeeEmailError] = useState("");
    const [employeeAddress, setEmployeeAddress] = useState("");
    const [employeeAddressError, setEmployeeAddressError] = useState("");
    const [employeePostalCode, setEmployeePostalCode] = useState("");
    const [employeeSalary, setEmployeeSalary] = useState("");
    const [employeeSalaryError, setEmployeeSalaryError] = useState("");
    const [employeeDateOfBirth, setEmployeeDateOfBirth] = useState("");
    const [employeeDateOfBirthError, setEmployeeDateOfBirthError] = useState("");
    const [employeeDateOfHire, setEmployeeDateOfHire] = useState("");
    const [employeeDateOfHireError, setEmployeeDateOfHireError] = useState("");
    const [employeeJobTitleId, setEmployeeJobTitleId] = useState("");
    const [employeeJobTitleIdError, setEmployeeJobTitleIdError] = useState("");
    const [employeeBusinessId, setEmployeeBusinessId] = useState("");
    const [employeeBusinessIdError, setEmployeeBusinessIdError] = useState("");
    const [employeePassword, setEmployeePassword] = useState("");
    const [employeePasswordError, setEmployeePasswordError] = useState("");
    const [employeePasswordConfirmation, setEmployeePasswordConfirmation] = useState("");
    const [employeePasswordConfirmationError, setEmployeePasswordConfirmationError] = useState("");

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableEmployee, setEditableEmployee] = useState(null);

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

    async function fetchEmployees() {
    try {
        const response = await fetch(`http://localhost:8000/business/${businessId}/employees`);
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
        throw new Error("Failed to fetch employees");
        }
        setEmployees(data);
        } catch (error) {
        console.error("Failed to fetch employees", error.message);
        }
    }

    useEffect(() => {
        fetchEmployees();
        }, []);

    async function fetchJobTitles() {
        try {
            const response = await fetch("http://localhost:8000/jobpositions");
            const data2 = await response.json();
            console.log(data2);

            if (!response.ok) {
                throw new Error("Failed to fetch job titles");
            }
            setJobTitles(data2);
        }
        catch (error) {
            console.error("Failed to fetch job titles", error.message);
        }
    }

    useEffect(() => {
        fetchJobTitles();
    }, []);

    async function fetchBusinesses() {
        try {
            const response = await fetch("http://localhost:8000/businesses");
            const data3 = await response.json();
            console.log(data3);

            if (!response.ok) {
                throw new Error("Failed to fetch businesses");
            }
            setBusinesses(data3);
        } catch (error) {
            console.error("Failed to fetch businesses", error.message);
        }
    }

    useEffect(() => {
        fetchBusinesses();
    }, []);


    function deleteInventoryFromState(employeeId) {
        const newEmployees = employees.filter((employee) => employee.id !== employeeId);
        setEmployees(newEmployees);
    }

    async function deleteEmployee() {
        if (selectedEmployeeId == null) {
            console.error("No employee is selected to delete");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/employees/${selectedEmployeeId}`, {
                method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete employee");
        }
        deleteInventoryFromState(selectedEmployeeId);
        } catch (error) {
            console.error("Failed to delete employee", error.message);
        } finally {
            setDeleteModalOpen(false);
            setSelectedEmployeeId(null);
        }
    }

    function validateForm(){
        let isValid = true;
        setEmployeeFirstNameError("");
        setEmployeeLastNameError("");
        setEmployeePhoneNumberError("");
        setEmployeeEmailError("");
        setEmployeeAddressError("");
        setEmployeeSalaryError("");
        setEmployeeDateOfBirthError("");
        setEmployeeDateOfHireError("");
        setEmployeeJobTitleIdError("");
        setEmployeeBusinessIdError("");
        setEmployeePasswordError("");
        setEmployeePasswordConfirmationError("");

        if (!employeeFirstName.trim()) {
            setEmployeeFirstNameError("First name is required");
            isValid = false;
        }

        if (!employeeLastName.trim()) {
            setEmployeeLastNameError("Last name is required");
            isValid = false;
        }

        const phoneRegex  = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/;
        if (!employeePhoneNumber.trim() || !phoneRegex.test(employeePhoneNumber)) {
            setEmployeePhoneNumberError("Phone number is invalid");
            isValid = false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!employeeEmail.trim() || !emailRegex.test(employeeEmail)) {
            setEmployeeEmailError("Email is invalid");
            isValid = false;
        }

        if (!employeeAddress.trim()) {
            setEmployeeAddressError("Address is required");
            isValid = false;
        }

        if (employeeSalary < 0 || employeeSalary === null || employeeSalary === "") {
            setEmployeeSalaryError("Salary is invalid");
            isValid = false;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!employeeDateOfBirth.trim() || !dateRegex.test(employeeDateOfBirth)) {
            setEmployeeDateOfBirthError("Date of birth is invalid");
            isValid = false;
        }

        if (!employeeDateOfHire.trim() || !dateRegex.test(employeeDateOfHire)) {
            setEmployeeDateOfHireError("Date of hire is invalid");
            isValid = false;
        }

        if (employeeJobTitleId === null || employeeJobTitleId === undefined || employeeJobTitleId === "") {
            setEmployeeJobTitleIdError("Job title is required");
            isValid = false;
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!employeePassword.trim() || !passwordRegex.test(employeePassword)) {
            setEmployeePasswordError("Password is invalid");
            isValid = false;
        }

        if (employeePassword !== employeePasswordConfirmation) {
            setEmployeePasswordConfirmationError("Passwords do not match");
            isValid = false;
        }

        return isValid;
    }

    const handleEditClick = (employee) => {
        setIsEditMode(true);
        setEditableEmployee(employee);
        setShowAddModal(true);
        setEmployeeFirstName(employee.first_name);
        setEmployeeLastName(employee.last_name);
        setEmployeePhoneNumber(employee.phone_number);
        setEmployeeEmail(employee.email);
        setEmployeeAddress(employee.address);
        setEmployeePostalCode(employee.postal_code);
        setEmployeeSalary(employee.salary);
        setEmployeeDateOfBirth(employee.date_of_birth);
        setEmployeeDateOfHire(employee.date_of_hire);
        setEmployeeJobTitleId(employee.job_position_id);
        setEmployeeBusinessId(currentBusiness.id);
        setEmployeePassword(employee.password);

    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

    const employeeData = JSON.stringify({
        first_name: employeeFirstName,
        last_name: employeeLastName,
        phone_number: employeePhoneNumber,
        email: employeeEmail,
        address: employeeAddress,
        postal_code: employeePostalCode,
        salary: employeeSalary,
        date_of_birth: employeeDateOfBirth,
        date_of_employment: employeeDateOfHire,
        job_position_id: parseInt(employeeJobTitleId, 10),
        business_id: businessId,
        password: employeePassword,
    });
    console.log(employeeData);

    const url = isEditMode
        ? `http://localhost:8000/employees/${editableEmployee.id}`
        : `http://localhost:8000/business/${businessId}/employee`;

    const method = isEditMode ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken()}`,
            },
            body: employeeData,
        });

        if (!response.ok) {
            const data3 = await response.json();
            console.log(data3);
            throw new Error(data3.message);
        }

        setShowAddModal(false);
        setIsEditMode(false);
        setEditableEmployee(null);
        setEmployeeFirstName("");
        setEmployeeLastName("");
        setEmployeePhoneNumber("");
        setEmployeeEmail("");
        setEmployeeAddress("");
        setEmployeePostalCode("");
        setEmployeeSalary("");
        setEmployeeDateOfBirth("");
        setEmployeeDateOfHire("");
        setEmployeeJobTitleId("");
        setEmployeeBusinessId("");
        setEmployeePassword("");
        setEmployeePasswordConfirmation("");
        fetchEmployees();

    } catch (error) {
        console.error("Failed to add employee", error.message);
    }
};

    return (
        <div className="max-w-7xl h-screen">
            <div className="max-h-[500px] my-8 bg-white border shadow-md">
                {/* Delete Modal Start */}
                {deleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex overflow-auto bg-gray-800 bg-opacity-50">
                        <div className="relative flex flex-col w-full max-w-md p-8 m-auto bg-white rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold">Confirm Delete</h2>
                            <p className="mt-4">Are you sure you want to delete this employee?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 text-black bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteEmployee()}
                                    className="px-4 py-2 text-white bg-red-500 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Delete Modal End */}

                {/* Add Modal Start */}
                {showAddModal && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-auto bg-gray-100 bg-opacity-90">
                        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:w-1/2 ">
                            <form 
                                onSubmit={handleFormSubmit}
                                className="px-4 py-4 sm:p-8"
                                noValidate
                            >
                            <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-6">

                                {/* Employee First name */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeFirstName"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeeFirstName"
                                            value={employeeFirstName}
                                            onChange={(e) => setEmployeeFirstName(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                        {employeeFirstNameError && <div className="text-red-600">You must enter a first name</div>}
                                </div>

                                {/* Employee last name */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeLastName"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeeLastName"
                                            value={employeeLastName}
                                            onChange={(e) => setEmployeeLastName(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        /> 
                                    </div>
                                    {employeeLastNameError && <div className="text-red-600">You must enter a last name</div>}
                                </div>
                                        
                                {/* Employee Phone Number */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeePhoneNumber"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeePhoneNumber"
                                            value={employeePhoneNumber}
                                            onChange={(e) => setEmployeePhoneNumber(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeePhoneNumberError && <div className="text-red-600">You must enter a valid phone number</div>}
                                </div>
                                            
                                {/* Employee Email */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeEmail"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeeEmail"
                                            value={employeeEmail}
                                            onChange={(e) => setEmployeeEmail(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeeEmailError && <div className="text-red-600">You must enter a valid email</div>}
                                </div>
                                                
                                {/* Employee Address */}
                                <div className="sm:col-span-6">
                                    <label
                                        htmlFor="employeeAddress"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeeAddress"
                                            value={employeeAddress}
                                            onChange={(e) => setEmployeeAddress(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeeAddressError && <div className="text-red-600">You must enter an address</div>}
                                </div>
                                                    
                                {/* Employee Postal Code */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeePostalCode"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Postal Code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="employeePostalCode"
                                            value={employeePostalCode}
                                            onChange={(e) => setEmployeePostalCode(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                                        
                                {/* Employee Salary */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeSalary"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Salary
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            id="employeeSalary"
                                            value={employeeSalary}
                                            onChange={(e) => setEmployeeSalary(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeeSalaryError && <div className="text-red-600">You must enter a valid salary</div>}
                                </div>
                                                            
                                {/* Employee Date of Birth */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeDateOfBirth"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Date of Birth
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            id="employeeDateOfBirth"
                                            value={employeeDateOfBirth}
                                            onChange={(e) => setEmployeeDateOfBirth(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeeDateOfBirthError && <div className="text-red-600">You must enter a valid date of birth</div>}
                                </div>
                                                                
                                {/* Employee Date of Hire */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeeDateOfHire"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Date of Hire
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            id="employeeDateOfHire"
                                            value={employeeDateOfHire}
                                            onChange={(e) => setEmployeeDateOfHire(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeeDateOfHireError && <div className="text-red-600">You must enter a valid date of hire</div>}
                                </div>
                                                                    
                                {/* Employee Job Title */}
                                <div className="sm:col-span-6">
                                    <label
                                        htmlFor="employeeJobTitleId"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Job Title
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="employeeJobTitleId"
                                            value={employeeJobTitleId}
                                            onChange={(e) => setEmployeeJobTitleId(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        >
                                            <option value="">Select Job Title</option>
                                            {jobTitles.map((jobTitle) => (
                                                <option key={jobTitle.id} value={jobTitle.id}>
                                                    {jobTitle.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {employeeJobTitleIdError && <div className="text-red-600">You must select a job title</div>}
                                </div>
                                                                         
                                {/* Employee Password */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeePassword"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            id="employeePassword"
                                            value={employeePassword}
                                            onChange={(e) => setEmployeePassword(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeePasswordError && <div className="text-red-600">You must enter a valid password</div>}
                                </div>
                                                                                
                                {/* Employee Password Confirmation */}
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="employeePasswordConfirmation"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            id="employeePasswordConfirmation"
                                            value={employeePasswordConfirmation}
                                            onChange={(e) => setEmployeePasswordConfirmation(e.target.value)}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    {employeePasswordConfirmationError && <div className="text-red-600">Passwords do not match</div>}
                                </div>
                            </div>
                                                                                

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end px-4 py-4 gap-x-6 border-gray-900/10 sm:px-8">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-2 py-1.5 text-sm font-semibold leading-6 text-white bg-gray-500 rounded-md hover:bg-black"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-2 text-sm font-semibold text-white bg-amber-500 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {isEditMode ? "Update" : "Add"}
                                </button>                                                                     
                            </div>
                        </form>
                        </div>
                    </div>
                )}
                {/* Add Modal End */}

                {/* Employee Table */}
                <div className="p-6">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <p className="mt-2 text-sm text-gray-500">
                                List of employees in {businessName}
                            </p>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                           <button
                               onClick={() => {
                                        setEditableEmployee
                                        setIsEditMode(false);
                                        setShowAddModal(true);
                                    }
                                }
                                type="button"
                                className="block px-3 py-2 text-sm font-semibold text-center text-white bg-amber-500 rounded-md shadow-sm hover:hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Add Employee
                            </button>
                        </div>
                    </div>
                    <div className="flow-root mt-8 h-[400px] overflow-y-outo overflow-x-hidden">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                            >
                                                First Name
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Last Name
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Phone Number
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Email
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Address
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Salary
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Date of Birth
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Date of Hire
                                            </th>
                                            <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Job Title
                                            </th>
                                            {/* <th
                                            scope="col"
                                            className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Business
                                            </th> */}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-300">
                                            {employees.map((employee) => (
                                                <tr key={employee.id}>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.first_name}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.last_name}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.phone_number}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.email}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.address}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.salary}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.date_of_birth}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.date_of_employment}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.job_title}
                                                    </td>
                                                    {/* <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                                        {employee.business}
                                                    </td> */}
                                                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                        <button
                                                            onClick={() => handleEditClick(employee)}
                                                            className="text-black hover:text-indigo-400"
                                                        >
                                                            Edit
                                                            <span className="sr-only"></span>
                                                        </button>
                                                    </td>
                                                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                                                        <button
                                                            onClick={() => {
                                                                setDeleteModalOpen(true);
                                                                setSelectedEmployeeId(employee.id);
                                                            }}
                                                            className="ml-8 text-red-500 hover:text-red-900 mr-6"
                                                        >
                                                            Delete
                                                            <span className="sr-only"></span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                );
            }

export default EmployeesManager;