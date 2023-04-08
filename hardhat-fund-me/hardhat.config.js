require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

SEPOLIA_RPC = process.env.SEPOLIA_RPC;
SEPOLIA_KEY = process.env.SEPOLIA_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC,
      chainId: 11155111,
      accounts: [SEPOLIA_KEY]
    }
  }
};
