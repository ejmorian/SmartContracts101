const {network} = require("hardhat")
const {
  developmentNetwork,
  networkConfig,
  INITIAL_VALUE,
  DECIMALS,
} = require("../helper-hardhat-config")

module.exports = async ({getNameAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = network.config.chainId

  if (developmentNetwork.includes(network.name)) {
    const deployment = await deploy("MockV3Aggregator", {
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
