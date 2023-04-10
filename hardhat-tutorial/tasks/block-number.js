const {task} = require("hardhat/config")

task("block-number", "get current block number count of the network").setAction(async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("The block number of the current network is : ", blockNumber);
})

module.exports = {}