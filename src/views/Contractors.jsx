import React, { useEffect, useState } from "react";
import { initializeContract } from "../utils/web3";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";

const Contractors = () => {
  const [loading, setLoading] = useState(false);
  const [allContractors, setAllContractors] = useState([]);
  const [contractFA, setContractFA] = useState({});

  const fetchContractorList = async () => {
    setLoading(true);
    const contract = await initializeContract();
    setContractFA({ ...contract });
    const totalContractors = await contract.methods.contractorIndex().call();
    const contractorList = [];
    for (let i = 0; i < totalContractors; i++) {
      const contractor = await contract.methods.allContractor(i).call();
      const contractorAddress = await contract.methods.contractorList(i).call();
      console.log(contractorAddress);
      console.log(`contractor ${i} : ${contractor}`);
      console.log(contractor);
      contractorList.push({ ...contractor, 3: contractorAddress });
    }
    setAllContractors(contractorList);
    setLoading(false);
  };

  const handleContractorsApprove = async (contractor_address) => {
    console.log("inside approve");
    setLoading(true);
    if (localStorage.getItem("role") === "province") {
      const account = localStorage.getItem("wallet_address");
      const respond = await contractFA.methods
        .verifyContractor(contractor_address)
        .send({ from: account });
      console.log("status :>> ", respond.status);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContractorList();
  }, []);

  return (
    <>
      <BlockUi tag="div" blocking={loading}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-16">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Contractor Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allContractors.map((item, index) => (
                <tr
                  className="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {item[0]}
                  </th>
                  <td className="px-6 py-4 flex">
                    <span>Active</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                  </td>
                  <td className=" py-4">
                    {!item[2] ? (
                      <>
                        <button
                          className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white"
                          onClick={() => handleContractorsApprove(item[3])}
                        >
                          Approve
                        </button>
                      </>
                    ) : (
                      <button className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white">
                        View Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BlockUi>
    </>
  );
};

export default Contractors;
