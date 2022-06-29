import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { initializeContract, initializeContractERC20 } from "../utils/web3";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import Web3 from "web3";

const Profile = () => {
  const [contractFA, setContractFA] = useState({});
  const [contractERC20, setContractERC20] = useState({});
  const [balance, setBalance] = useState("");
  const [symbol, setSymbol] = useState("");
  const [noOfToken, setNoOfToken] = useState();
  const [loading, setLoading] = useState(false);
  const [provinceNumber, setProvinceNumber] = useState("");
  const [contractorNumber, setContractorNumber] = useState("");
  const [myProvince, setMyProvince] = useState({});

  const address = localStorage.getItem("wallet_address");
  const role = localStorage.getItem("role");

  const fetchERC20Details = async () => {
    const contract = await initializeContractERC20();
    setContractERC20({ ...contract });
    const balance = await contract.methods.balanceOf(address).call();
    setBalance((Number(balance) / 10 ** 18).toString());
    const symbol = await contract.methods.symbol().call();
    setSymbol(symbol);
  };

  const fetchContractDetails = async () => {
    const contract = await initializeContract();
    setContractFA({ ...contract });
    if (role === "admin") {
      const provinceNo = await contract.methods.provinceIndex().call();
      setProvinceNumber(provinceNo);
      const contractorNo = await contract.methods.contractorIndex().call();
      setContractorNumber(contractorNo);
    } else if (role === "province") {
      const province = await contract.methods
        .myProvince()
        .call({ from: address });
      setMyProvince(province);
    }
  };

  const handleMint = async () => {
    setLoading(true);
    console.log("Web3 :>> ", Web3);
    const token = Web3.utils.toWei(noOfToken);
    const response = await contractERC20.methods
      .mint(token, address)
      .send({ from: address });
    if (response) toast.success(`Successfully minted ${noOfToken} token`);
    else toast.error("Something went wrong");
    setLoading(false);
  };

  useEffect(() => {
    fetchERC20Details();
    fetchContractDetails();
  }, [loading]);

  return (
    <BlockUi tag="div" blocking={loading}>
      <div className="relative max-w-md mx-auto md:max-w-2xl mt-8 min-w-0 break-words bg-white w-full shadow-lg rounded-xl mt-16">
        <div className="px-6">
          {role === "admin" && (
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative mt-6">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/06/Emblem_of_Nepal_%282020%29.svg"
                    alt="logo"
                    className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                  />
                </div>
              </div>
              <div className="w-full text-center mt-12">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      1
                    </span>
                    <span className="text-sm text-slate-400">Admin</span>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      {provinceNumber || "-"}
                    </span>
                    <span className="text-sm text-slate-400">Provinces</span>
                  </div>

                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">
                      {contractorNumber || "-"}
                    </span>
                    <span className="text-sm text-slate-400">Contractors</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-2">
            <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
              {myProvince[1]} {role.charAt(0).toUpperCase() + role.slice(1)}
            </h3>
            {role === "province" && (
              <>
                <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
                  Province No.: {myProvince[2]}
                </div>
                <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>
                  Province Capital: {myProvince[3]}
                </div>
              </>
            )}
            <div className="text-xs mt-0 mb-2 text-slate-400 uppercase">
              Total Token Available:{" "}
              <strong>
                {balance || "-"} {symbol}
              </strong>
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
                {role === "admin" && (
                  <section class="flex justify-center mt-4">
                    <input
                      type="string"
                      placeholder="Number of Token to be minted"
                      class="border-2 transition duration-500 placeholder-red-400 focus:placeholder-transparent border-red-400 mr-4 py-2 text-center text-red-400 bg-transparent rounded-md focus:outline-none "
                      onChange={(e) => {
                        setNoOfToken(e.target.value);
                      }}
                    />
                    <p
                      onClick={handleMint}
                      className="font-normal mt-2 text-slate-700 hover:text-slate-400 hover:cursor-pointer"
                    >
                      Mint Token
                    </p>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlockUi>
  );
};

export default Profile;
