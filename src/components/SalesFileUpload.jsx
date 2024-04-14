import React, {useState, useContext, useEffect} from 'react';
import business from "../pages/Business.jsx";
import BusinessContext from '../contexts/BusinessContext';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const {currentBusiness} = useContext(BusinessContext);

  const fetchBusinessIdFromLocalStorage = () => {
    const businessInfo = localStorage.getItem("businessInfo");
    return businessInfo ? JSON.parse(businessInfo).id : "ID";
    };
    const businessId = fetchBusinessIdFromLocalStorage();


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

const handleSubmit = async () => {
  if (!selectedFile) {
    console.log('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile); // Assuming `selectedFile` is your file state
  formData.append('business_id', businessId); // Ensure this is correctly fetching the business ID

  try {
    const response = await fetch(`http://localhost:8000/update_sales_table/${businessId}`, {
      method: 'POST',
      body: formData,
      // Do not set Content-Type; let the browser set it for multipart/form-data
    });

    if (response.ok) {
      const result = await response.json();
      console.log('File uploaded and data inserted successfully', result);
      alert('File uploaded and data inserted successfully');
      window.location.reload();
    } else {
      // Handle non-2xx status codes
      const errorResult = await response.json(); // Adjusted to parse JSON body
      console.error('Failed to upload file and insert data', errorResult.detail);
      alert(`Error: ${errorResult.detail}`); // Display the backend-provided error message
  }
} catch (error) {
  console.error('Error during file upload and data insertion', error);
  alert(`Upload Error: ${error.message}`);
}
};





  return (
      <div className='flex flex-col justify-center items-center '>
        <div>
          <h1 className='text-center font-semibold text-xl'>Upload Sale file</h1>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
          htmlFor="file_input">
            Upload file
          </label>
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
              aria-describedby="file_input_help" 
              id="file_input" 
              type="file"
              onChange={handleFileChange}

              />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
            CSV (MAX. 10 Mb).
          </p>
      
        </div>
        <div>
          <button
              className="w-40 justify-center rounded-md bg-[#000000] my-4 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-4"
              onClick={handleSubmit}>Upload
          </button>
        </div>
      </div>
  );
}

export default FileUpload;
