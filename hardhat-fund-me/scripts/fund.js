const {getNamedAccounts, ethers, deployments} = require("hardhat")

const main = async () => {
  const {deployer} = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)

  console.log("Funding smarting contract...")
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("1"),
  })
  const transactionReceipt = await transactionResponse.wait(1)
  console.log("Deposit Success!")

  console.log("---------------------------------------------------")
  const deployerBalance = await ethers.provider.getBalance(deployer)
  console.log("your balance:", deployerBalance.toString())

  const contractBalance = await ethers.provider.getBalance(fundMe.address)
  console.log("contract balance:", contractBalance.toString())
  console.log("---------------------------------------------------")
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
