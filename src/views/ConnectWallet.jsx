import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { initializeContract, loadWeb3 } from "../utils/web3";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

const ConnectWallet = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const getLoadedWeb3 = async () => {
    setLoading(true);
    await loadWeb3({
      onSuccess: async (res) => {
        const contract = await initializeContract();
        console.log("contract :>> ", contract);
        const user = await contract.methods.findUserRole(res).call();
        localStorage.setItem("wallet_address", res);
        toast.success("Wallet Connected Successfully");
        if (user === "admin") {
          localStorage.setItem("role", user);
          setLoading(false);
          navigate("/");
        } else if (user === "province") {
          localStorage.setItem("role", user);
          setLoading(false);
          navigate("/");
        } else if (user === "contractor") {
          localStorage.setItem("role", user);
          setLoading(false);
          navigate("/");
        } else {
          navigate("/signup");
        }
      },
      onError: (err) => {
        console.log("Error :>> ", err);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (
      localStorage.getItem("wallet_address") &&
      ["admin", "province", "contractor"].includes(localStorage.getItem("role"))
    )
      navigate("/");
  });

  return (
    <>
      <BlockUi tag="div" blocking={loading}>
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center mt-32">
          <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
            <div className="w-3/5 p-5 bg-gray-300 rounded-tl-2xl rounded-bl-2xl">
              <div className="mt-24">
                <h2 className="text-2xl font-bold mvb-2 mt-12 text-teal-500 dark: text-gray-800">
                  Government Fund Allocation
                </h2>
                <h4 className="text-xl font-bold mvb-2 text-teal-500 dark: text-gray-800">
                  And
                </h4>
                <h3 className="text-2xl font-bold mvb-2 text-teal-500 dark: text-gray-800">
                  Tracking System
                </h3>
              </div>
            </div>
            <div className="w-2/5 bg-teal-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12 dark: bg-gray-800">
              <button
                className="border-2 border-white rounded-full px-12 py-2 hover:bg-white hover:text-teal-500 dark:hover:text-gray-800  dark: text-white"
                onClick={getLoadedWeb3}
              >
                Connect Wallet
              </button>
              {/* <button
                className="border-2 border-white rounded-full px-12 py-2 mt-2 hover:bg-white hover:text-teal-500 dark:hover:text-gray-800  dark: text-white"
                onClick={() => setShowModal(true)}
              >
                Sign Up
              </button> */}
            </div>
          </div>
        </main>
      </BlockUi>
    </>
  );
};

export default ConnectWallet;
