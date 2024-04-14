import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ResetConfirmationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("No reset token provided.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    let tokenString = token;

    tokenString = tokenString.replace(/^\{\s*\\?\'|\\?\'\}\s*$/g, "");

    const url = `http://localhost:8000/reset-password`;
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: tokenString, new_password: password }),
    };

    try {
      const response = await fetch(url, options);

      if (response.status === 404) {
        setError("User does not exist.");
      } else if (response.status === 400) {
        setError("The link has expired.");
      } else if (!response.ok) {
        throw new Error("An error occurred during the password reset process.");
      } else {
        setSuccessMessage(
          "Your password has been reset. Please log in with your new password.",
        );
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  function handleLoginRedirect() {
    navigate("/login");
  }

  return (
    <div className="flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {successMessage ? (
          <>
            <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
              Login
            </h2>
            <div className="mt-2 text-center text-green-500">
              {successMessage}
            </div>
            <button
              className="mt-4 w-full justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleLoginRedirect}
            >
              Login
            </button>
          </>
        ) : (
          <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
                Reset Password
              </h2>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="password" className="sr-only">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className={"flex flex-row justify-center space-x-6"}>
                  <button
                    type="submit"
                    className="flex w-40 justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
                {error && (
                  <div className="mt-2 text-center text-red-500">{error}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetConfirmationPage;
