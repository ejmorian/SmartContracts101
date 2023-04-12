import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

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

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const transactionResponse = await contract.fund({
    value: ethers.utils.parseEther(ethAmount.toString()),
  });

  const TransactionReceipt = await transactionResponse.wait(6);

  if (TransactionReceipt.status === 1) {
    console.log("funding sent!");
  } else {
    console.log("could not sent funding, please try again...");
  }
};

const withdraw = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const transactionResponse = await contract.cheaperWithdraw();
  const TransactionReceipt = await transactionResponse.wait(6);

  if (TransactionReceipt.status === 1) {
    console.log("withdraw success!");
  } else {
    console.log("withdrawal failed.. please try again");
  }
};

const getBalance = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const balance = await provider.getBalance(contractAddress);
  const etherBalance = ethers.utils.formatEther(balance.toString());

  console.log("contract balance:", etherBalance.toString());
};

function init() {
  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  document.getElementById("connect").addEventListener("click", connect);
  document.getElementById("fund").addEventListener("click", fund);
  document.getElementById("withdraw").addEventListener("click", withdraw);
  document.getElementById("balance").addEventListener("click", getBalance);
}

window.onload = init;
