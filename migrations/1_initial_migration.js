const FundAllocation = artifacts.require("FundAllocation");
const FAerc20 = artifacts.require("FAerc20");

module.exports = function (deployer) {
  deployer.deploy(FundAllocation);
  deployer.deploy(FAerc20, "Government Token", "GT");
};
