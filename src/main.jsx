import React from 'react';
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import MainDashboard from "./pages/MainDashboard.jsx";  
import LoggedInLayout from "./components/LoggedInLayout.jsx";
import Business from "./pages/Business.jsx";
import BusinessContext from './contexts/BusinessContext.jsx';
import Inventory from './pages/Inventory.jsx';
import Products from './pages/Products.jsx';
import Employees from './pages/Employees.jsx';
import Suppliers from './pages/Suppliers.jsx';
import Customers from './pages/Customers.jsx';
import Sales from './pages/Sales.jsx';
import { RequireToken } from "./util/auth.jsx";
import Orders from "./pages/Orders.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ResetConfirmationPage from "./pages/ResetConfirmationPage.jsx";


const App = () => {
    const [currentBusiness, setCurrentBusiness] = React.useState(null);

    return (
        <BusinessContext.Provider value={{currentBusiness, setCurrentBusiness}}>
            <Router>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/login" element={<LoginPage />}></Route>
                        <Route path="/signup" element={<SignUpPage />}></Route>
                        <Route path="/password_recovery" element={<ResetPasswordPage />}></Route>
                        <Route path="/resetpassword" element={<ResetConfirmationPage />}></Route>
                        <Route path="/about" element={<About />}></Route>
                        <Route path="/contact" element={<ContactUs />}></Route>
                    </Route>
                    <Route element={<LoggedInLayout/>}>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/login" element={<LoginPage />}></Route>
                        <Route path="/about" element={<RequireToken><About /></RequireToken>}></Route>
                        <Route path="/contact" element={<ContactUs />}></Route>
                        <Route path="/dashboard" element={<RequireToken><MainDashboard /></RequireToken>}></Route>
                        <Route path="/business" element={<RequireToken><Business /></RequireToken>}></Route>
                        <Route path="/business/inventory" element={<RequireToken><Inventory /></RequireToken>}></Route>
                        <Route path="/business/products" element={<RequireToken><Products /></RequireToken>}></Route>
                        <Route path="/business/employees" element={<RequireToken><Employees /></RequireToken>}></Route>
                        <Route path="/business/suppliers" element={<RequireToken><Suppliers /></RequireToken>}></Route>
                        <Route path="/business/customers" element={<RequireToken><Customers /></RequireToken>}></Route>
                        <Route path="/business/sales" element={<RequireToken><Sales /></RequireToken>}></Route>
                        <Route path="/business/orders" element={<RequireToken><Orders /></RequireToken>}></Route>
                    </Route>
                </Routes>
            </Router>
        </BusinessContext.Provider>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
