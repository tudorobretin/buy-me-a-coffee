// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function getBalance(address) {
  // Here, provider is a node and hardhat's tool looks to find the balance of given address.
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx}: ${address}`)
    console.log(`Balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the entries stored on-chain from coffee donations.

async function printEntries(entries) {
  for (const entry of entries) {
    console.log(`
    At ${entry.timestamp},
    ${entry.name}
    ${entry.from}
    said: "${entry.message}"`)
  }
}

async function main() {
  // Get example accounts.
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get the contract and deploy it.

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  // Get contract instance -V
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

  // Check balances before cofee purchase.
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log("== Balances before purchase ==");
  await printBalances(addresses);
  // await printBalances([tipper1.address,tipper2.address,tipper3.address]); check

  // Buy the owner a few coffees.
  console.log("== Buying coffees... ==");
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper1).buyCoffee("tipper1Name", "message1", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("tipper2Name", "message2", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("tipper3Name", "message3", tip);

  // Check balances after purchases.
  console.log("== Balances after purchase ==");
  await printBalances(addresses);

  // Withdraw donations.
  console.log("== Withdrawing money ==");
  await buyMeACoffee.connect(owner).withdrawMoney();

  // Check balances after withdraw.
  console.log("== Balances after owner withdrawl ==");
  await printBalances(addresses);

  // Read all the messages left by donors.
  console.log("== Messages left by tippers ==");
  const messages = await buyMeACoffee.getEntries();
  printEntries(messages);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
