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
      const response = await fundMe.priceFeedAddress()
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
        assert.equal(deployer, await fundMe.funders(0))
      })

      it("funder corresponds to their contribution amount", async () => {
        const contribution = await fundMe.addressToAmountFunded(deployer)
        assert.equal(Number(value), Number(contribution))
      })
    })
  })

  describe("Withdraw", async () => {
    it("revert transaction if not deployer", async () => {
      const {users} = await getNamedAccounts()
      const fundMe2 = await ethers.getContract("FundMe", users)

      await expect(fundMe2.withdraw()).to.be.reverted
      //   fundMe = await ethers.getContract("FundMe", user)
    })
  })

  it("deployer can withdraw", async () => {
    await expect(fundMe.withdraw()).to.not.be.reverted
  })

  describe("reset record", async () => {
    beforeEach(async () => {
      await fundMe.withdraw()
    })

    it("funders list is reset", async () => {
      await expect(fundMe.funders(0)).to.be.reverted
    })

    it("mapping address to contribution is reset", async () => {
      assert.equal(await fundMe.addressToAmountFunded(deployer), 0)
    })

    it("clears contract address", async () => {
      contractBalance = await ethers.provider.getBalance(fundMe.address)
      assert.equal(contractBalance, 0)
    })
  })

  it("balance updated accordingly", async () => {
    await fundMe.fund({value: value})
    const intialDeployerBalance = await ethers.provider.getBalance(deployer)
    const intialContractBalance = await ethers.provider.getBalance(
      fundMe.address
    )

    const transactionResponse = await fundMe.withdraw()
    const transactionReciept = await transactionResponse.wait(1)

    const gasCost =
      transactionReciept.gasUsed * transactionReciept.effectiveGasPrice
    const DeployerBalance = await ethers.provider.getBalance(deployer)
    const ContractBalance = await ethers.provider.getBalance(fundMe.address)

    const expected = intialDeployerBalance
      .add(intialContractBalance)
      .sub(gasCost)

    assert.equal(ContractBalance, 0)
    assert.equal(DeployerBalance.toString(), expected.toString())
  })
})
