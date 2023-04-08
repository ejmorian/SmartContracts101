const {ethers, run, network} = require("hardhat");
require("dotenv").config()

async function main(){

  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(`deployed contract to : ${simpleStorage.address}`);

  if ( network.config.chainID === 11155111 && ETHERSCAN_API_KEY){
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }else{
    console.log("cannot verify contract in hardhat")
  }

  const currentValue = await simpleStorage.favouriteNumber();
  console.log(`current value is ${currentValue}`);
  const transactionResponse = await simpleStorage.setFavouriteNumber(101);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.favouriteNumber();
  console.log(`updated value is ${updatedValue}`);

}

async function verify(contractAddress, args){
  console.log("verifying contract...");
  try{
    await run("verify:verify", {
      address: contractAddress,
      constructor: args
    });
  }catch (e){
    if (e.message.toLowerCase().includes("already verified")){
      console.log("already verified");
    } else
    console.log(e);
  }



}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});