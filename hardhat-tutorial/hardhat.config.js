require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  }
};
