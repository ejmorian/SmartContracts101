const {network, run} = require("hardhat")
const {networkConfig, developmentNetwork} = require("../helper-hardhat-config")
const verify = require("../utils/verify")
require("dotenv").config()

module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy, log} = deployments
  const {deployer} = await getNamedAccounts()
  const chainId = network.config.chainId

  let priceFeed

  if (developmentNetwork.includes(network.name)) {
    const MockV3Aggregator = await deployments.get("MockV3Aggregator")
    priceFeed = MockV3Aggregator.address
  } else {
    priceFeed = networkConfig[chainId].ethUsdPriceFeed
  }

  const args = [priceFeed]

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  //verify if not development server
  if (
    !developmentNetwork.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  } else {
    log("in a development network. can not verify...")
  }

  log("-------------------------------------------------------")
}

module.exports.tags = ["all", "fundMe"]
