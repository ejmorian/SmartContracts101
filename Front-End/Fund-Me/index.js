import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

const status = document.getElementById("status");

const connect = async () => {
  if (typeof window.etherum) {
    console.log("I see");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connect").innerText = "Connected!";
    console.log("connected");
  } else {
    document.getElementById("connect").innerText = "Install Metamask!";
    console.log("no metamask");
  }
};

const fund = async () => {
  const ethAmount = document.getElementById("input").value;

  try {
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount.toString()),
    });
    const TransactionReceipt = await transactionResponse.wait(1);
    await txMine(transactionResponse, provider);
    if (TransactionReceipt.status === 1) {
      console.log("funding sent!");
      status.innerText = "funding sent!";
    } else {
      console.log("could not sent funding, please try again...");
      status.innerText = "could not sent funding, please try again...";
    }
  } catch (e) {
    console.log(e);
  }
};

const withdraw = async () => {
  try {
    const transactionResponse = await contract.cheaperWithdraw();
    const TransactionReceipt = await transactionResponse.wait(1);
    await txMine(transactionResponse, provider);
    if (TransactionReceipt.status === 1) {
      console.log("withdraw success!");
      status.innerText = "withdraw success!";
    } else {
      console.log("withdrawal failed.. please try again");
      status.innerText = "withdrawal failed.. please try again";
    }
  } catch (e) {
    console.log(e);
  }
};

const getBalance = async () => {
  const balance = await provider.getBalance(contractAddress);

  try {
    const etherBalance = ethers.utils.formatEther(balance.toString());
    console.log("contract balance:", etherBalance.toString());
    status.innerText = `contract balance: ${etherBalance.toString()}`;
  } catch (e) {
    console.log(e);
  }
};

const txMine = (transactionResponse, provider) => {
  console.log(`mining: ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log("block-confirmations:", transactionReceipt.confirmations);
      resolve();
    });
  });
};

async function init() {
  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  document.getElementById("connect").addEventListener("click", connect);
  document.getElementById("fund").addEventListener("click", fund);
  document.getElementById("withdraw").addEventListener("click", withdraw);
  document.getElementById("balance").addEventListener("click", getBalance);
  const accounts = await provider.listAccounts();
  console.log(accounts);
}

window.onload = init;
