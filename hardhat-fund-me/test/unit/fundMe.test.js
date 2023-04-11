const {deployments, getNamedAccounts, ethers, network} = require("hardhat")
const {assert, expect} = require("chai")

describe("Fund Me", async () => {
  let fundMe
  let deployer
  let mockV3Aggregator
  const value = ethers.BigNumber.from(10000000000000000000n)
  //alternatively can use ethers.utils.parse("1")

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer //gets an account from the config
    await deployments.fixture("all") // runs deploy scripts with "all" export tag
    fundMe = await ethers.getContract("FundMe", deployer)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })

  describe("Constructor", async () => {
    it("correct eth to usd price feed address is passed", async () => {
      const response = await fundMe.getPriceFeedAddress()
      assert.equal(response, mockV3Aggregator.address)
    })
  })

  describe("Fund", async () => {
    it("transaction to be reverted if no value is sent", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("Didn't Send Enough Eth")
    })

    it("transaction to continue if enough eth is sent", async () => {
      await expect(fundMe.fund({value: value})).to.not.reverted
    })

    describe("funders records", async () => {
      beforeEach(async () => {
        await fundMe.fund({value: value})
      })

      it("Smart contract balance is updated with the amount of eth sent", async () => {
        expect(value).to.equal(await ethers.provider.getBalance(fundMe.address))
      })

      it("Adds the funder to the list", async () => {
        assert.equal(deployer, await fundMe.getFunders(0))
      })

      it("funder corresponds to their contribution amount", async () => {
        const contribution = await fundMe.getAddressToAmountFunded(deployer)
        assert.equal(Number(value), Number(contribution))
      })
    })
  })

  //   describe("Withdraw", async () => {
  //     it("revert transaction if not deployer", async () => {
  //       const accounts = await ethers.getSigners()

  //       accounts.forEach(async (address) => {
  //         const users = await fundMe.connect(address)
  //         users.fundMe.fund({value: value})

  //         await expect(users.fundMe.withdraw()).to.be.reverted
  //       })
  //     })

  //     it("deployer can withdraw", async () => {
  //       await expect(fundMe.withdraw()).to.not.be.reverted
  //     })

  //     describe("reset record", async () => {
  //       beforeEach(async () => {
  //         await fundMe.withdraw()
  //       })

  //       it("funders list is reset", async () => {
  //         await expect(fundMe.getFunders(0)).to.be.reverted
  //       })

  //       it("mapping address to contribution is reset", async () => {
  //         const users = await ethers.getSigners()
  //         users.forEach(async (user) => {
  //           assert.equal(await fundMe.getAddressToAmountFunded(user), 0)
  //         })
  //       })

  //       it("clears contract address", async () => {
  //         contractBalance = await ethers.provider.getBalance(fundMe.address)
  //         assert.equal(contractBalance, 0)
  //       })
  //       it("balance updated accordingly", async () => {
  //         await fundMe.fund({value: value})
  //         // Arrange
  //         const intialDeployerBalance = await ethers.provider.getBalance(deployer)
  //         const intialContractBalance = await ethers.provider.getBalance(
  //           fundMe.address
  //         )
  //         // Act
  //         const transactionResponse = await fundMe.withdraw()
  //         const transactionReciept = await transactionResponse.wait(1)

  //         const gasCost = transactionReciept.gasUsed.mul(
  //           transactionReciept.effectiveGasPrice
  //         )
  //         const DeployerBalance = await ethers.provider.getBalance(deployer)
  //         const ContractBalance = await ethers.provider.getBalance(fundMe.address)

  //         const expected = intialDeployerBalance
  //           .add(intialContractBalance)
  //           .sub(gasCost)

  //         // Assert
  //         assert.equal(ContractBalance, 0)
  //         assert.equal(DeployerBalance.toString(), expected.toString())
  //       })
  //     })
  //   })

  describe("cheaperWithdraw", async () => {
    it("revert transaction if not deployer", async () => {
      const accounts = await ethers.getSigners()

      accounts.forEach(async (address) => {
        const users = await fundMe.connect(address)
        users.fundMe.fund({value: value})

        await expect(users.fundMe.cheaperWithdraw()).to.be.reverted
      })
    })

    it("deployer can withdraw", async () => {
      await expect(fundMe.cheaperWithdraw()).to.not.be.reverted
    })

    describe("reset record", async () => {
      beforeEach(async () => {
        await fundMe.cheaperWithdraw()
      })

      it("funders list is reset", async () => {
        await expect(fundMe.getFunders(0)).to.be.reverted
      })

      it("mapping address to contribution is reset", async () => {
        const users = await ethers.getSigners()
        users.forEach(async (user) => {
          assert.equal(await fundMe.getAddressToAmountFunded(user), 0)
        })
      })

      it("clears contract address", async () => {
        contractBalance = await ethers.provider.getBalance(fundMe.address)
        assert.equal(contractBalance, 0)
      })
    })

    it("balance updated accordingly", async () => {
      await fundMe.fund({value: value})
      // Arrange
      const intialDeployerBalance = await ethers.provider.getBalance(deployer)
      const intialContractBalance = await ethers.provider.getBalance(
        fundMe.address
      )
      // Act
      const transactionResponse = await fundMe.cheaperWithdraw()
      const transactionReciept = await transactionResponse.wait(1)

      const gasCost = transactionReciept.gasUsed.mul(
        transactionReciept.effectiveGasPrice
      )
      const DeployerBalance = await ethers.provider.getBalance(deployer)
      const ContractBalance = await ethers.provider.getBalance(fundMe.address)

      const expected = intialDeployerBalance
        .add(intialContractBalance)
        .sub(gasCost)

      // Assert
      assert.equal(ContractBalance, 0)
      assert.equal(DeployerBalance.toString(), expected.toString())
    })
  })
})
