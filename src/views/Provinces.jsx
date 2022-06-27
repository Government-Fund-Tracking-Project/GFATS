import React, { useEffect, useState } from "react";
import { initializeContract } from "../utils/web3";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";

const Provinces = () => {
  const [loading, setLoading] = useState(false);
  const [allProvinces, setAllProvinces] = useState([]);
  const [contractFA, setContractFA] = useState({});

  const fetchProvinceList = async () => {
    setLoading(true);
    const contract = await initializeContract();
    setContractFA({ ...contract });
    const totalProvinces = await contract.methods.provinceIndex().call();
    const provinceList = [];
    for (let i = 0; i < totalProvinces; i++) {
      const province = await contract.methods.allProvince(i).call();
      console.log("province :>> ", province);
      provinceList.push(province);
    }
    setAllProvinces(provinceList);
    setLoading(false);
  };

  const handleProvinceApprove = async (province_address) => {
    setLoading(true);
    if (localStorage.getItem("role") === "admin") {
      const account = localStorage.getItem("wallet_address");
      const respond = await contractFA.methods
        .verifyProvince(province_address)
        .send({ from: account });
      console.log("status :>> ", respond.status);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProvinceList();
  }, []);

  return (
    <>
      <BlockUi tag="div" blocking={loading}>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-16">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Provinces/States
                </th>
                <th scope="col" className="px-6 py-3">
                  Province No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Capital
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
              {allProvinces.map((item, index) => (
                <tr
                  className="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {item[0]} Province
                  </th>
                  <td className="px-6 py-4">{item[1]}</td>
                  <td className="px-6 py-4">{item[2]}</td>
                  <td className="px-6 py-4 flex">
                    <span>{item[5] ? "Active" : "Inactive"}</span>
                    {item[5] ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                    )}
                  </td>
                  <td className=" py-4">
                    {!item[5] ? (
                      <>
                        <button
                          className="border-2 border-teal-500 text-teal-500 rounded-full px-4 py-2 mr-2 hover:bg-teal-500 hover:text-white"
                          onClick={() => handleProvinceApprove(item[3])}
                        >
                          Approve
                        </button>
                        <button className="border-2 border-red-600 text-red-600 rounded-full px-4 py-2 hover:bg-red-600 hover:text-white">
                          Reject
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

export default Provinces;
