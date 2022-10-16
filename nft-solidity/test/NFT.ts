import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TestToken } from "../typechain-types";

describe("TestToken", function () {
  let token: TestToken;
  let owner: SignerWithAddress;
  let other: SignerWithAddress;

    before(async () => {
      [owner, other] = await ethers.getSigners();
      const Token = await ethers.getContractFactory("TestToken");
      token = await Token.deploy("MyTestToken", "MTT");
    });

    it("start should revert when called by other address than owner.", async function () {
      await expect(token.connect(other).start()).to.be.revertedWith(
        "Only owner can start it."
      );
    });

    it("Should not mintTo before starting the contract.", async function () {
      await expect(token.mintTo(owner.address)).to.be.revertedWith(
        "Onwer has not started the minting yet."
      );
    });

    it("Should mintTo.", async function () {
      await token.start();
      await token.mintTo(other.address);
    });
});
