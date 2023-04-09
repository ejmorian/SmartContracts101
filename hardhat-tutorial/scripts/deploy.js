const {ethers} = require("hardhat");

const main = async () => {
    const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    console.log("deploying contract...");
    const simpleStorage = await simpleStorageFactory.deploy();
    simpleStorage.deployed();
    console.log(`succesful. contract:${simpleStorage.address}`);


}

main().then(()=> process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})