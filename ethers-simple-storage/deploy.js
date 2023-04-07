//import Ethers.js for node runtime
const { ethers } = require("ethers");
// package for handling files
const fs = require("fs-extra");
//install env package
require("dotenv").config();


// async function for waiting for functions that fetches an API
async function main() {

    // connects to local ethereum network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    // initialise ethereum wallet
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY_PASSWORD);
    wallet = await wallet.connect(provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    const contract = new ethers.ContractFactory(abi, bin, wallet);
    const mycontract = await contract.deploy();

    const contractTxReceipt =  await mycontract.deployTransaction.wait(1);
    console.log(contractTxReceipt);

    const currentFavouriteNumber = await mycontract.favouriteNumber();
    console.log(`favourite number is : ${currentFavouriteNumber.toString()}`);
    const transactionResponse = await mycontract.setFavouriteNumber("7");
    const transactionReciept = transactionResponse.wait(1);
    const updatedFavouriteNumber = await mycontract.favouriteNumber();
    console.log(transactionReciept);
    console.log(`updated favourite number : ${updatedFavouriteNumber.toString()}`);

}

main().then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1);
})
