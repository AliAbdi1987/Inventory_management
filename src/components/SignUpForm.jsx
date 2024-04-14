import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [firstNameErrMsg, setFirstNameErrMsg] = useState([]);

  const [lastName, setLastName] = useState("");
  const [lastNameErrMsg, setLastNameErrMsg] = useState([]);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberErrMsg, setPhoneNumberErrMsg] = useState([]);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const [rePassword, setRePassword] = useState("");
  const [rePasswordError, setRePasswordError] = useState([]);

  const [termsOfAgreement, setTermsOfAgreement] = useState(false);
  const [termsOfAgreementError, setTermsOfAgreementError] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMassage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  function handleFirstName(e) {
    setFirstName(e.target.value);
    if (firstNameErrMsg.length > 0) {
      setFirstNameErrMsg([]);
    }
  }

  function handleLastName(e) {
    setLastName(e.target.value);
    if (lastNameErrMsg.length > 0) {
      setLastNameErrMsg([]);
    }
  }

  function handlePhoneNumber(e) {
    setPhoneNumber(e.target.value);
    if (phoneNumberErrMsg.length > 0) {
      setPhoneNumberErrMsg([]);
    }
  }


  function validateFirstName() {
    let firstNameErrors = []
    if (!firstName.trim()) {
      firstNameErrors.push("First name is required");
    } else if (firstName.length < 2 || firstName.length >= 51) {
      firstNameErrors.push("First name must be between 2 and 50 characters");
    }
    setFirstNameErrMsg(firstNameErrors);
    return firstNameErrors;
  }

  function validateLastName() {
    let lastNameErrors = []
    if (!lastName.trim()) {
      lastNameErrors.push("Last name is required");
    } else if (lastName.length < 2 || lastName.length >= 51) {
      lastNameErrors.push("Last name must be between 2 and 50 characters");
    }
    setLastNameErrMsg(lastNameErrors);
    return lastNameErrors;
  }

  function validatePhoneNumber() {
    let phoneNumberErrors = []
    const regex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/;
    if (!phoneNumber.trim()) {
      phoneNumberErrors.push("Phone number is required");
    } else if (!regex.test(phoneNumber)) {
      phoneNumberErrors.push("Invalid Phone number");
    }
    setPhoneNumberErrMsg(phoneNumberErrors);
    return phoneNumberErrors;
  }

  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      emailErrors.push("Email is required");
    } else if (!regex.test(email)) {
      emailErrors.push("Enter a valid email");
    }
    setEmailError(emailErrors);
    return emailErrors
  }

  function validatePassword() {
    let passwordErrors = [];
    if (!password) {
      passwordErrors.push("Password is required");
    } else {
       if (password.length < 8 || password.length > 20) {
      passwordErrors.push("Password must be between 8 and 20 characters");
    }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push("Password must contain at least one uppercase letter");
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push("Password must contain at least one lowercase letter");
      }
      if (!/[0-9]/.test(password)) {
        passwordErrors.push("Password must contain at least one number");
      }
  }

    setPasswordError(passwordErrors);
    return passwordErrors
  }

  function validateRePassword() {
    let rePasswordErrors = [];
    if (!rePassword) {
      rePasswordErrors.push("Please re-enter your password");
    } else if (rePassword !== password) {
      rePasswordErrors.push("Passwords do not match");
    }
    setRePasswordError(rePasswordErrors);
    return rePasswordErrors
  }

  function validateTerms(){
    let termsOFAgreementErrors = []
    if (!termsOfAgreement){
      termsOFAgreementErrors.push("You must agree to terms and conditions")
    }
    setTermsOfAgreementError(termsOFAgreementErrors)
    return termsOFAgreementErrors
  }

  async function submitRegister(e) {
    e.preventDefault();

    const firstNameErrors = validateFirstName()
    const lastNameErrors = validateLastName()
    const phoneNumberErrors = validatePhoneNumber()
    const emailErrors = validateEmail();
    const passwordErrors = validatePassword();
    const rePasswordErrors = validateRePassword();
    const termsOFAgreementErrors = validateTerms();
    setSuccessMessage("")
    setErrorMessage("")

    if (firstNameErrors.length === 0
        && lastNameErrors.length === 0
        && phoneNumberErrors.length === 0
        && emailErrors.length === 0
        && passwordErrors.length === 0
        && rePasswordErrors.length === 0
        && termsOFAgreementErrors.length === 0
    ) {
      console.log("Registration successful!");
      let ownerInfo = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: email,
        password: password
      };
      try {
        const response = await fetch("http://localhost:8000/owner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ownerInfo),
        });
        const data = await response.json();
        if (response.ok) {
          setSuccessMessage("You have been registered successfully!");
    } else {
      setErrorMessage(data.error || "This email or phone number is already registered!")
    }
              } catch (error) {
        console.error("Error:", error);
        setErrorMessage("An error occurred while connecting to the server!")
      }
  } else {
    setErrorMessage("Please correct the errors before submitting!")
    }
  }

  function handleLoginRedirect() {
    navigate("/login");
  }

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitRegister} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                * First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={handleFirstName}
                  autoComplete="off"
                />
                {firstNameErrMsg.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="LastName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                * Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  name="LastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={handleLastName}
                />
                {lastNameErrMsg.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                * Phone number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  autoComplete="off"
                />
                {phoneNumberErrMsg.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                * Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError.length > 0) {
                      setEmailError([]);
                    }
                  }}
                />
                {emailError.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  * Password <br /><span className="text-gray-300">(8-20 characters, at least one uppercase, one lowercase, one number)</span>
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError.length > 0) {
                      setPasswordError([]);
                    }
                  }}
                />
                {passwordError.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rePassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  * Re-enter password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="rePassword"
                  name="rePassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  value={rePassword}
                  onChange={(e) => {
                    setRePassword(e.target.value);
                    if (rePasswordError.length > 0) {
                      setRePasswordError([]);
                    }
                  }}
                />
                {rePasswordError.map((error, index) => (
                  <p key={index} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="termsOfAgreement" className="flex items-center">
                <input
                  id="termsOfAgreement"
                  type="checkbox"
                  checked={termsOfAgreement}
                  onChange={(e) => {
                    setTermsOfAgreement(e.target.checked);
                    if (termsOfAgreementError.length > 0) {
                      setTermsOfAgreementError([]);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2">I agree to the terms and conditions</span>
              </label>
              {termsOfAgreementError.map((error, index) => (
                <p key={index} className="text-red-500">{error}</p>
              ))}
            </div>

            <div className={"flex flex-row justify-center space-x-6"}>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
            <div>

              {successMessage && (
                <> 
                 <p className="text-green-500">{successMessage}</p>
                  <button
                    className="mt-4 w-full justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={handleLoginRedirect}
                  >
                    Login
                  </button>
                </>
                )}
              {errorMassage && <p className="text-red-500">{errorMassage}</p>}

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export {RegisterForm};
