import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import Swal from "sweetalert2";
import { initializeContractERC20 } from "../../utils/web3";
import { toast } from "react-toastify";

const ProvincesDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [provinceAddress, setProvinceAddress] = useState(
    location.state?.provinceAddress || ""
  );
  const [province, setProvince] = useState(location.state?.province || {});
  const [loading, setLoading] = useState(false);

  const allocateToken = async () => {
    const { value: tokenAmount } = await Swal.fire({
      title: "Allocate token to",
      input: "number",
      inputLabel: `${provinceAddress}`,
      inputPlaceholder: "Enter the token number",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });
    if (tokenAmount) {
      setLoading(true);
      const adminAddress = localStorage.getItem("wallet_address");
      const token = (tokenAmount * 10 ** 18).toString();
      console.log("token :>> ", token);
      const contractERC20 = await initializeContractERC20();
      try {
        await contractERC20.methods
          .transfer(provinceAddress, token)
          .send({ from: adminAddress });
        toast.success("Successfully transfered token");
        setLoading(false);
      } catch (error) {
        console.log("error :>> ", error);
        toast.error("Something went wrong!!!");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (provinceAddress === "") navigate("/provinces");
  });

  return (
    <BlockUi tag="div" blocking={loading}>
      <div className="relative max-w-md mx-auto md:max-w-2xl mt-8 min-w-0 break-words bg-white w-full shadow-lg rounded-xl mt-16">
        <div className="px-6">
          {/* <div className="text-center mt-2">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
              sgdf
            </h3>

            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
              Province No.
            </div>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
              Province Capital
            </div>
          </div> */}
          <div className="text-center mt-2">
            <div className="mt-6 border-t border-slate-200 text-center"></div>

            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
              {province[0]} Province
            </h3>
            <div className="border-t border-slate-200 text-center"></div>
          </div>
          <div class="flex flex-row mt-4">
            <div class="basis-2/5 text-center font-bold">Province Number</div>
            <div class="basis-3/5 text-center">{province[1]}</div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Capital</div>
            <div class="basis-3/5 text-center">{province[2]}</div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Wallet Address</div>
            <div class="basis-3/5 text-center">{province[3]}</div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">
              Registration Status
            </div>
            <div class="basis-3/5 text-center">
              {province[4] ? "Registered" : "Unregistered"}
            </div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Approval Status</div>
            <div class="basis-3/5 text-center">
              {province[5] ? "Approved" : "Unapproved"}
            </div>
          </div>
          <div className="mt-6 py-6 border-t border-slate-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="font-light leading-relaxed text-slate-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              {province[5] && (
                <div>
                  <p
                    className="inline-block text-sm px-4 py-2 cursor-pointer leading-none border rounded text-red-500 font-bold border-red-600 hover:border-transparent hover:text-white hover:bg-red-600 mt-4 lg:mt-0"
                    onClick={allocateToken}
                  >
                    Allocate Token To {province[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BlockUi>
  );
};

export default ProvincesDetail;
