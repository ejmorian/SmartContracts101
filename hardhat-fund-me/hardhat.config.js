require("dotenv").config({path: __dirname + "/.env"})
require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan") //adds verify task
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "RPC_URL"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "P_KEY"
const PRIVATE_KEY_TWO = process.env.PRIVATE_KEY || "P_KEY2"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY"
const CMC_API_KEY = process.env.CMC_API_KEY || "CMC_KEY"

module.exports = {
  // solidity: "0.8.18",
  solidity: {
    compilers: [{version: "0.8.18"}, {version: "0.6.6"}],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [
        "b489d81d1508d63bb55dbbfcc3e1b42556229decdfbc1ea0b3645aa51d1ab010",
        PRIVATE_KEY_TWO,
      ],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: CMC_API_KEY,
    noColors: true,
    outputFile: "./gas-report.txt",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    users: {
      default: 1,
    },
  },
}
