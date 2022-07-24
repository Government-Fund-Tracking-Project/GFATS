import Web3 from "web3";
import FundAllocation from "../abis/FundAllocation.json";
import FAerc20 from "../abis/FAerc20.json";

const noOp = () => {};

export const loadWeb3 = async ({ onSuccess = noOp, onError = noOp }) => {
  console.log("Web3.givenProvider", Web3.givenProvider);
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      const { web3 } = window;
      const accounts = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();
      if (chainId !== 97) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x61",
              chainName: "binance_testnet",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              blockExplorerUrls: ["https://testnet.bscscan.com"],
            },
          ],
        });
      }
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

export const initializeContractERC20 = async () => {
  if (window.web3) {
    const { web3 } = window;
    const { abi } = FAerc20;
    const networkId = await web3.eth.net.getId();
    const networkData = FAerc20.networks[networkId];
    const { address } = networkData;
    const contract = new web3.eth.Contract(abi, address);
    return contract;
  } else {
    console.log("Error");
  }
};
