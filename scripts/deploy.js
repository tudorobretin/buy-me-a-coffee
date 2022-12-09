const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("BuyMeACoffee");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("BuyMeACoffee deployed to: ", contract.address);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });