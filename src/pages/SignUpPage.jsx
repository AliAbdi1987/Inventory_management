import React from "react";
import SignUpForm from "../components/SignUpForm.jsx"
function LoginPage(){
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-auto">
        <div className="container mx-auto max-w-7xl">
            <SignUpForm></SignUpForm>
        </div>
      </div>
    </div>
  );
}

export default LoginPage