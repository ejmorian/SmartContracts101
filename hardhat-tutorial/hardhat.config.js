require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();
const {ethers} = require("ethers");
require("./tasks/block-number");
require("solidity-coverage");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "RPC_URL"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "P_KEY"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ||  "ETHERSCAN_API_KEY"
const CMC_API_KEY = process.env.CMC_API_KEY || "CMC_KEY"


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: CMC_API_KEY,
    outputFile: "./test/gasreport.txt",
    noColors: true
  }
};
