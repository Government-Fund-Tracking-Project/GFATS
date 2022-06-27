import Web3 from "web3";
import FundAllocation from "../abis/FundAllocation.json";

const noOp = () => {};

export const loadWeb3 = async ({ onSuccess = noOp, onError = noOp }) => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      const { web3 } = window;
      const accounts = await web3.eth.getAccounts();
      // const balance = await web3.eth.getBalance(accounts[0]);
      // console.log("balance :>> ", balance);
      // console.log("object :>> ", web3.eth.getChainId());
      onSuccess(accounts[0]);
    } catch (error) {
      onError(error);
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log("Error :>> ", "Error");
  }
};

// export const initializeContract = async ({
//   onSuccess = noOp,
//   onError = noOp,
// }) => {
//   if (window.web3) {
//     const { web3 } = window;
//     const { abi } = FundAllocation;
//     const networkId = await web3.eth.net.getId();
//     const networkData = FundAllocation.networks[networkId];
//     const { address } = networkData;
//     const contract = new web3.eth.Contract(abi, address);
//     onSuccess(contract);
//     // const role = await contract.methods.findUserRole(wallet).call();
//     // return role;
//   } else {
//     onError("error");
//   }
// };

export const initializeContract = async () => {
  if (window.web3) {
    const { web3 } = window;
    const { abi } = FundAllocation;
    const networkId = await web3.eth.net.getId();
    const networkData = FundAllocation.networks[networkId];
    const { address } = networkData;
    const contract = new web3.eth.Contract(abi, address);
    return contract;
    // const role = await contract.methods.findUserRole(wallet).call();
    // return role;
  } else {
    console.log("Error");
  }
};
