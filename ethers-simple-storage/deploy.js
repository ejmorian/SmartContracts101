const { ethers } = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // initialise rpc and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // get abi and bytecode
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

    // create contract
    const contract = new ethers.ContractFactory(abi, bin, wallet)
    console.log("deploying please wait...")
    // deploy contract
    const mycontract = await contract.deploy({gasLimit : 1000000})
    console.log(`contract address : ${mycontract.address}` )
}

async function store(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

    const contract = new ethers.Contract("0xDB740D6A9198BaB78bC2cC27AC826c696E8d3785", abi, wallet);

    console.log("retrieving...")
    const setNumber = await contract.setFavouriteNumber("123");
    await setNumber.wait(1);
    const Number = await contract.favouriteNumber();
    console.log(`favourite number is : ${Number}`);


}

store()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
