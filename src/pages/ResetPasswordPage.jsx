import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm.jsx"
function ResetPasswordPage(){
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-auto">
        <div className="container mx-auto max-w-7xl">
            <ResetPasswordForm></ResetPasswordForm>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage