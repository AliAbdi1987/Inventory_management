import { data } from "autoprefixer";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fetchToken, setToken } from "../util/auth.jsx";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      emailErrors.push("Email is required");
    } else if (!regex.test(email)) {
      emailErrors.push("Enter a valid email");
    }
    setEmailError(emailErrors);
    return emailErrors;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address."); // Set an error message
      return; // Prevent form submission
    }

    // Reset error state if email passes validation
    setEmailError("");
    const response = await fetch(
      `http://localhost:8000/password-recovery/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username: email }),
      },
    );

    if (response.ok) {
      setSuccessMessage("Reset password email has been sent");
      // const data = await response.json();
      // localStorage.setItem("ownerData", JSON.stringify({
      //   owner_id: data.owner_id,
      //   first_name: data.first_name,
      //   last_name: data.last_name,
      // }));
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      // setEmailError("Invalid email. Please try again.");
    }
  };

  return (
    <div className="flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {successMessage ? (
          <>
            <div className="mt-2 text-center text-green-500">
              {successMessage}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
                Reset Password
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              {/* <form onSubmit={submitLogin} className="space-y-6" > */}
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    * Enter your email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {/*{emailError.map((error) => (*/}
                      <p  className="text-red-500">
                        {emailError}
                      </p>
                    {/*))}*/}
                  </div>
                </div>

                <div className={"flex flex-row justify-center space-x-6"}>
                  <button
                    // type="submit"
                    onClick={handleSubmit}
                    className="flex w-40 justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Send reset link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
