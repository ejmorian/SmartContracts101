const { network } = require("hardhat")

function greet() {
  console.log("Hi")
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts
  const chainId = network.config.chainId
}

module.exports.tags = ["contract01"]
