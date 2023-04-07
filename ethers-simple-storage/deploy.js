const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

    const wallet = new ethers.Wallet("0xb112e3303c9e9c9b61fc2627787704424c2d399a63b3d2e4853c7bd7701ea749", provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("deploying.. please wait..");
    const contract = await contractFactory.deploy(); // stop here, wait for contract to finish
    console.log(contract);
}

main().then(() => process.exit(0)).catch((error)=> console.log(error));