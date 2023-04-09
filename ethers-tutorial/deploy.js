const {ethers} = require("ethers");
const fs = require("fs");
const { get } = require("http");
require("dotenv").config();

RPC_URL = process.env.RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;


const main = async () => {

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


    //get abi and bytecode
    const abi = fs.readFileSync("./compile/contracts_SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const bytecode = fs.readFileSync("./compile/contracts_SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    //create contract instance
    const simpleStorageFactory = new ethers.ContractFactory(abi, bytecode, wallet);

    let _nonce = await provider.getTransactionCount(wallet.address);
    //deploy contract
    console.log("deploying contract...");
    const contract = await simpleStorageFactory.deploy({nonce: _nonce});
    console.log("successful... address:", contract.target);

    // update favourite number
    console.log("current number is:", Number(await contract.retrieve()));
    console.log("updating favourite number...")
    await contract.store(1);
    console.log("new number is:", Number(await contract.retrieve()));



}
main().then(()=> process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})
