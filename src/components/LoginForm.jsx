import { data } from "autoprefixer";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {fetchToken, setToken} from "../util/auth.jsx";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

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

  function validatePassword() {
    let passwordErrors = [];
    if (!password) {
      passwordErrors.push("Password is required");
    }
    setPasswordError(passwordErrors);
    return passwordErrors;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({ username: email, password})
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("ownerData", JSON.stringify({
        owner_id: data.owner_id,
        first_name: data.first_name,
        last_name: data.last_name,
      }));
      localStorage.setItem("token", data.token)
      setToken(data.token);
      navigate("/dashboard");
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Login an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form onSubmit={submitLogin} className="space-y-6" > */}
          <form className="space-y-6" >
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
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError.map((error) => (
                  <p key={error} className="text-red-500">
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
                  * Password
                </label>

                <div className="text-sm">
                  <Link to={"/password_recovery"}>
                  <a
                    href="#"
                    className="font-semibold text-[#950101] hover:text-[#FF0000]"
                  >
                    Forgot password?
                  </a>
                  </Link>
                </div>

              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#950101] sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError.map((error) => (
                  <p key={error} className="text-red-500">
                    {error}
                  </p>
                ))}
              </div>
            </div>

            <div className={"flex flex-row justify-center space-x-6"}>
              <button
                // type="submit"
                onClick={handleSubmit}
                className="flex w-40 justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
              
              <Link to="/signup">
                <button
                  type="button"
                  className="flex w-40 justify-center rounded-md bg-[#000000] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#950101] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </Link>
            </div>
            {loginError && <div className="text-red-500">{loginError}</div>}
          </form>
        </div>
      </div>
    </>
  );
}