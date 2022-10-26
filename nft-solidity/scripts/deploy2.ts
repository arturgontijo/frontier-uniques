import { ethers } from "hardhat";

async function main() {
  const alice = '0xd43593c715fdd31c61141abd04a99fd6822c8558';
  const bob = '0x8eaf04151687736326c9fea17e25fc5287613693';

  const Token = await ethers.getContractFactory("TestToken2");
  const testToken2 = await Token.deploy(alice, "MyTestToken2", "MTK2");
  await testToken2.deployed();
  console.log(`NFT2 contract deployed to ${testToken2.address}`);

  console.log(`Minting 3 NFT2 to Alice: ${alice}`);
  await testToken2.mintTo(alice, '0x0000000000000000000000000000000000000000000000000000000000000001');
  await testToken2.mintTo(alice, '0x0000000000000000000000000000000000000000000000000000000000000002');
  await testToken2.mintTo(alice, '0x0000000000000000000000000000000000000000000000000000000000000003');

  console.log(`Minting 2 NFT2 to Bob: ${bob}`);
  await testToken2.mintTo(bob, '0x1111111111111111111111111111111111111111111111111111111111111111');
  await testToken2.mintTo(bob, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
