import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("TestToken");
  const token = await Token.deploy("MyTestToken", "MTT");
  await token.deployed();
  console.log(`NFT contract deployed to ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
