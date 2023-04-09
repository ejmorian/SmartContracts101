const {ethers} = require("ethers");
const fs = require("fs");
require("dotenv").config();



const main = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    //create wallet with encrypted key
    const encryptedKey = fs.readFileSync("./.encryptedKey.json");
    let wallet = await ethers.Wallet.fromEncryptedJson(encryptedKey, process.env.PASSWORD);
    wallet = wallet.connect(provider);


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
