import React from "react";
import { useNavigate } from "react-router-dom";

const ContactAdmin = () => {
  const navigate = useNavigate();
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-teal-500 dark:bg-gray-800">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
        Contact the Admin for your Approval
      </div>
      <button
        className="relative inline-block text-sm font-medium text-red-700 group active:text-orange-500 focus:outlne-none focus:ring "
        onClick={() => navigate("/connect-wallet")}
      >
        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-red-700 group-hover:translate-y-0 group-hover:translate-x-0"></span>

        <span className="relative block px-8 py-3 bg-teal-500 border border-current dark:bg-gray-800">
          Connect Wallet
        </span>
      </button>
    </main>
  );
};

export default ContactAdmin;
