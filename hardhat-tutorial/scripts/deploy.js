const {ethers, run, network} = require("hardhat");
require("dotenv").config();

const main = async () => {
    // testnet wallet
    // let seploliaWallet = await new ethers.Wallet.fromEncryptedJson("../.encryptedKey.json", process.env.PASSWORD);
    // seploliaWallet.connect(network.sepolia);

    const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    console.log("deploying contract...");
    const simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployTransaction.wait(1)
    console.log(`succesful ->> address : ${simpleStorage.address}`);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
        await verify(simpleStorage.address, []);
    } else{
        console.log("network is most likely local. cannot verify!")
    }
    console.log("done");
}

// verify contract on etherscan programmatically
const verify = async (contract_address, args) => {
    // using CLI: npx hardhat verify --network testnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1";
    console.log("verifying contract... ");
    try{
        await run("verify", {
            address: contract_address,
            constructorArgsParams: args
        })
    }catch(e){
        if(e.message.toLowerCase().includes("verified")){
            console.log("Contract is already verified..")
        }else{
            console.log(e);
        }
    }



}

main().then(()=> process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})