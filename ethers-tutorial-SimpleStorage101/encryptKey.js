const {ethers, Wallet} = require("ethers");
const fs = require("fs");
require("dotenv").config();

const main = async () => {

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const encryptedJsonKey = await wallet.encrypt(process.env.PASSWORD);
    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);

    console.log(encryptedJsonKey);

}

main().then(()=> process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})