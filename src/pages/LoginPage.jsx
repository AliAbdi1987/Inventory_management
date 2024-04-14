import React from "react";
import LoginForm from "../components/LoginForm.jsx"
function LoginPage(){
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-auto">
        <div className="container mx-auto max-w-7xl">
            <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
}

export default LoginPage