const {network} = require("hardhat")
const {
  developmentNetwork,
  INITIAL_VALUE,
  DECIMALS,
} = require("../helper-hardhat-config")

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()

  if (developmentNetwork.includes(network.name)) {
    await deploy("MockV3Aggregator", {
      from: deployer,
      args: [DECIMALS, INITIAL_VALUE],
      log: true,
    })
  }

  log(
    "------------------------------------------------------------------------------------------"
  )
}

module.exports.tags = ["mocks", "all"]
