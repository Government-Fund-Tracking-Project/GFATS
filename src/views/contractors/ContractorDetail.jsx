import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import Swal from "sweetalert2";
import { initializeContract, initializeContractERC20 } from "../../utils/web3";
import Web3 from "web3";
import { toast } from "react-toastify";

const ContractorDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [contractorAddress, setContractorAddress] = useState(
    location?.state?.contractorAddress || ""
  );
  const [contractorDetail, setContractorDetail] = useState(
    location?.state?.contractor || ""
  );
  const [currentAddress, setCurrentAddress] = useState("");
  const [role, setRole] = useState("");
  const [contractFA, setContractFA] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);
  const [allProject, setAllProject] = useState([]);

  const allocateToken = async () => {
    const { value: tokenAmount } = await Swal.fire({
      title: "Allocate token to",
      input: "text",
      inputLabel: `${contractorAddress}`,
      inputPlaceholder: "Enter the token number",
      confirmButtonText: "Confirm",
    });
    if (tokenAmount) {
      setLoading(true);
      const token = Web3.utils.toWei(tokenAmount);

      const contractERC20 = await initializeContractERC20();
      try {
        await contractERC20.methods
          .transfer(contractorAddress, token)
          .send({ from: currentAddress });
        toast.success("Successfully transfered token");
        setLoading(false);
      } catch (error) {
        console.log("error :>> ", error);
        toast.error("Something went wrong!!!");
        setLoading(false);
      }
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    const contract = await initializeContract();
    setContractFA({ ...contract });
    const myAddress = localStorage.getItem("wallet_address");
    setCurrentAddress(myAddress);
    const myRole = localStorage.getItem("role");
    setRole(myRole);
    const projectList = [];
    const totalProjects = await contract.methods.projectIndex().call();

    for (let i = 0; i < totalProjects; i++) {
      const project = await contract.methods.allProject(i).call();
      if (project[4] === contractorAddress) projectList.push(project);
    }
    console.log("projectList :>> ", projectList);

    setAllProject(projectList);
    setLoading(false);
  };

  useEffect(() => {
    console.log("contractorDetail :>> ", contractorDetail);
    if (!contractorAddress) navigate("/contractors");
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchStatus]);

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
              {contractorDetail[1]}
            </h3>
            <div className="border-t border-slate-200 text-center"></div>
          </div>
          {/* <div class="flex flex-row mt-4">
            <div class="basis-2/5 text-center font-bold">contractorDetail Number</div>
            <div class="basis-3/5 text-center">{contractorDetail[1]}</div>
          </div> */}
          {/* <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Capital</div>
            <div class="basis-3/5 text-center">{contractorDetail[2]}</div>
          </div> */}
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Wallet Address</div>
            <div class="basis-3/5 text-center">{contractorAddress}</div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">
              Registration Status
            </div>
            <div class="basis-3/5 text-center">
              {contractorDetail[2] ? "Registered" : "Unregistered"}
            </div>
          </div>
          <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Approval Status</div>
            <div class="basis-3/5 text-center">
              {contractorDetail[3] ? "Approved" : "Unapproved"}
            </div>
          </div>
          {/* <div class="flex flex-row">
            <div class="basis-2/5 text-center font-bold">Available Token</div>
            <div class="basis-3/5 text-center">
              {contractorDetail[2] ? "Approved" : "Unapproved"}
            </div>
          </div> */}
          <div className="text-center mt-2">
            <div className="mt-6 border-t border-slate-200 text-center"></div>

            <h5 className="text-xl text-slate-700 font-bold leading-normal mb-1">
              Assigned Projects
            </h5>
          </div>
          <div className="py-6 border-t border-slate-200">
            <div className="flex flex-wrap">
              <div className="w-full px-4">
                <ul className="my-4 space-y-3">
                  {allProject.map((item, index) => (
                    <li key={index}>
                      <p className="flex space-between p-3 font-bold text-gray-900 bg-gray-50 rounded-lg dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                        <span className="flex-1 ml-3 whitespace-nowrap">
                          {item[1]}
                        </span>
                        {item[3] === currentAddress && role === "province" && (
                          <div className="w-full text-end">
                            <p
                              className="inline-block text-sm px-4 py-2 cursor-pointer leading-none border rounded text-red-500 font-bold border-red-600 hover:border-transparent hover:text-white hover:bg-red-600 mt-4 lg:mt-0"
                              onClick={allocateToken}
                            >
                              Allocate Token
                            </p>
                          </div>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              {/* {localStorage.getItem("role") === "province" &&
                contractorDetail[2] && (
                  <div className="w-full text-center">
                    <p
                      className="inline-block text-sm px-4 py-2 cursor-pointer leading-none border rounded text-red-500 font-bold border-red-600 hover:border-transparent hover:text-white hover:bg-red-600 mt-4 lg:mt-0"
                      onClick={allocateToken}
                    >
                      Allocate Token To {contractorDetail[0]}
                    </p>
                  </div>
                )} */}
            </div>
          </div>
        </div>
      </div>
    </BlockUi>
  );
};

export default ContractorDetail;
