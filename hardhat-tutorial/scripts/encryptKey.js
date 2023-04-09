require("dotenv").config()
const {ethers} = require("hardhat");
const fs = require("fs");

const main = async () => {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(process.env.PASSWORD)

    // save the encrypted key
    // console.log(encryptedJsonKey);
    // fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);

}

main().then(()=> process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})