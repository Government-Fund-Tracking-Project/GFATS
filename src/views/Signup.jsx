import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeContract } from "../utils/web3";

const Signup = () => {
  const navigate = useNavigate();
  const [province, setProvince] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const account = localStorage.getItem("wallet_address");

    const contract = await initializeContract();
    if (province) {
      const registerProvince = await contract.methods
        .registerProvince(
          formData.get("name"),
          formData.get("state"),
          formData.get("capital")
        )
        .send({ from: account });
      if (registerProvince) {
        navigate("/connect-wallet");
      } else {
        window.alert("Province Registration Failed");
      }
    } else {
      const registerContractor = await contract.methods
        .registerContractor(formData.get("name"))
        .send({ from: account });
      if (registerContractor) {
        navigate("/connect-wallet");
      } else {
        window.alert("Contractor Registration Failed");
      }
    }
  };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div class="relative p-4 w-full max-w-md h-full md:h-auto">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="authentication-modal"
              onClick={() => navigate("/")}
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <div class="py-6 px-6 lg:px-8">
              <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Sign up as a {province ? "Province" : "Contractor"}
              </h3>
              <form class="space-y-6" action="#" onSubmit={handleRegister}>
                <div>
                  <label
                    for="name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {province ? "Province" : "Contractor"} Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder={province ? "Bagmati" : "John Construction"}
                    required
                  />
                </div>
                {province && (
                  <>
                    <div>
                      <label
                        for="state"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        State Number
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="3"
                        required
                      />
                    </div>
                    <div>
                      <label
                        for="capital"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Capital
                      </label>
                      <input
                        type="text"
                        name="capital"
                        id="capital"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Hetauda"
                        required
                      />
                    </div>
                  </>
                )}

                {/* <div class="flex justify-between">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <label
                      for="remember"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    class="text-sm text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Lost Password?
                  </a>
                </div> */}
                <button
                  type="submit"
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Register
                </button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {/* Not registered?{" "} */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setProvince((prev) => !prev);
                    }}
                    class="text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Signup as a {province ? "Contractor" : "Province"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
  );
};

export default Signup;
