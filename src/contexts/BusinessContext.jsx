// BusinessContext.jsx
import React from 'react';


const BusinessContext = React.createContext({
  currentBusiness: null, // This will hold the current business object
  setCurrentBusiness: () => {} // This function will be used to change the current business
});

// const BusinessInfo = () => {
//   localStorage.setItem("Business ID", currentBusiness.id);
// }

// const setBusinessInfo = (business) => {
//   localStorage.setItem("currentBusiness", JSON.stringify(business));
// }

// const getBusinessInfo = () => {
//   return JSON.parse(localStorage.getItem("currentBusiness"));
// }

// const BusinessProvider = ({children}) => {
//   const [currentBusiness, setCurrentBusiness] = React.useState(getBusinessInfo());

//   const handleSetCurrentBusiness = (business) => {
//     setBusinessInfo(business);
//     setCurrentBusiness(business);
//   }

// const deleteBusinessInfo = () => {
//   localStorage.removeItem("currentBusiness");
// }

//   return (

//     <BusinessContext.Provider value={{currentBusiness, setCurrentBusiness: handleSetCurrentBusiness}}>
//       {children}
//     </BusinessContext.Provider>
//   );

// }


export default BusinessContext;




