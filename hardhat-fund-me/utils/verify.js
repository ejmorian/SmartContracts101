const {run} = require("hardhat")

const verify = async (contractAddress, args) => {
  try {
    await run("verify", {address: contractAddress, constructorArgsParams: args})
  } catch (e) {
    if (e.message.toLowerCase().includes("verified")) {
      console.log("Contract is already verified...")
    } else {
      console.error(e)
    }
  }
}

module.exports = verify
