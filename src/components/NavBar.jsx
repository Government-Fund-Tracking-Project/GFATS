import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const disconnectWallet = () => {
    localStorage.clear();
    toast.success("Wallet disconnected Successful");
    navigate("/connect-wallet");
  };
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 dark:bg-gray-800 p-3">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <NavLink
            to="/"
            className="font-semibold text-xl tracking-tight text-teal-400"
          >
            GFA`&`TS
          </NavLink>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <NavLink
              to="/profile"
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 dark:text-white dark:hover:text-gray-800"
            >
              Profile
            </NavLink>
            {role === "admin" && (
              <>
                <NavLink
                  to="/provinces"
                  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 dark:text-white dark:hover:text-gray-800"
                >
                  Provinces
                </NavLink>
              </>
            )}
            {(role === "admin" || role === "province") && (
              <>
                <NavLink
                  to="/contractors"
                  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white dark:text-white dark:hover:text-gray-800"
                >
                  Contractors
                </NavLink>
              </>
            )}
          </div>
          <div>
            <p className="inline-block text-sm px-4 py-2 cursor-pointer leading-none border rounded text-white border-teal-400 text-teal-400 mr-2 hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 dark:hover:text-gray-800">
              {localStorage.getItem("wallet_address")}
            </p>
          </div>
          <div>
            <p
              className="inline-block text-sm px-4 py-2 cursor-pointer leading-none border rounded text-red-500 font-bold border-red-600 hover:border-transparent hover:text-white hover:bg-red-600 mt-4 lg:mt-0"
              onClick={disconnectWallet}
            >
              Disconnect
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
