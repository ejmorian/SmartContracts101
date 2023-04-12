const {
  Deployments,
  getNamedAccounts,
  ethers,
  deployments,
  network,
} = require("hardhat")
const {
  networkConfig,
  developmentNetwork,
} = require("../../helper-hardhat-config")
const {assert, expect} = require("chai")

developmentNetwork.includes(network.name)
  ? describe.skip
  : describe("Fund Me", async () => {
      let deployer
      let fundMe
      let chainId
      const value = ethers.utils.parseEther("0.040")

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
        chainId = network.config.chainId
      })

      describe("constructor", async () => {
        it("Correct Price Feed Address is Passed", async () => {
          const priceFeedAddress = await fundMe.getPriceFeedAddress()
          const networkPriceFeed = networkConfig[chainId].ethUsdPriceFeed
          assert.equal(priceFeedAddress, networkPriceFeed)
        })
      })

      describe("fund", async () => {
        it("revert if minimum value is not sent", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "Didn't Send Enough Eth"
          )
        })

        // it("contract recives the sent value", async () => {
        //   const intialContractBalance = await ethers.provider.getBalance(
        //     fundMe.address
        //   )

        //   const transactionResponse = await fundMe.fund({value: value})
        //   const transactionReceipt = await transactionResponse.wait(6)

        //   const gasCost = transactionReceipt.gasUsed.mul(
        //     transactionReceipt.effectiveGasPrice
        //   )
        //   const valueSent = value.sub(gasCost)

        //   const contractBalance = await ethers.provider.getBalance(
        //     fundMe.address
        //   )

        //   assert.equal(contractBalance, intialContractBalance.add(valueSent))
        // })
      })

      describe("withdraw", async () => {
        it("only owner can withdraw", async () => {
          const user = await ethers.getSigner()
        })
      })
    })
