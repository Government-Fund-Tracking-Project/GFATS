import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import web3 from "web3-eth-abi";
import Web3 from "web3";

const Home = () => {
  const [transaction, setTransaction] = useState([]);

  const fetchTransferHistory = async () => {
    const block = "20567797";
    const contractAddress = "0xFE72d36dda46B51bdC85881890B9479bf1416F3c";
    const topic =
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const apiKey = "5HHA2GRZIBK93MCZBDH1CAUZA6T2BFDWY3";
    const data = await axios.get(
      `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&fromBlock=${block}&address=${contractAddress}&topic0=${topic}&apiKey=${apiKey}`
    );
    setTransaction(data.data.result);
  };

  const decodeParameterForTitle = (data) => {
    const value = web3.decodeParameter("address", data);
    if (value === "0x0000000000000000000000000000000000000000")
      return "Token minted";
    else return "Token Transfered";
  };

  const decodeTimeStamp = (timestamp) => {
    const time = moment.unix(timestamp);
    return time.toString();
  };

  const decodeAddress = (data) => {
    return web3.decodeParameter("address", data);
  };

  const decodeTokenData = (data) => {
    const wei = web3.decodeParameter("uint256", data);
    return Web3.utils.fromWei(wei, "ether");
  };

  useEffect(() => {
    const user = localStorage.getItem("role").toUpperCase();
    toast.info(`You are logged in as ${user}`);
    fetchTransferHistory();
  }, []);
  return (
    <div className="flex max-h-screen">
      <div className="flex-auto w-24 bg-teal-500 h-screen text-center justify-center text-center">
        <div className="mt-52 text-2xl font-bold">Government</div>
        <div className="text-3xl font-bold">Fund Allocation</div>
        <div className="font-bold">&</div>
        <div className="text-2xl font-bold">Tracking System</div>
      </div>
      <div className="flex-auto w-72 overflow-y-auto">
        <div className="m-8">
          <div className="text-center text-2xl font-bold mb-4">
            Transaction History
          </div>
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            {transaction.map((item, index) => (
              <li className="mb-10 ml-6">
                <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-3 h-3 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {decodeParameterForTitle(item["topics"][1])}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {decodeTimeStamp(item["timeStamp"])}
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  from: {decodeAddress(item["topics"][1])}
                </p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  to: {decodeAddress(item["topics"][2])}
                </p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Token: {decodeTokenData(item["data"])} GT
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
