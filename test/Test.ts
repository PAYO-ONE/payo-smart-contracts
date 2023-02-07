import { expect } from "chai";
import { Signer, Contract } from "ethers";
import { ethers } from "hardhat";
import { PayoTransfer__factory } from "../typechain-types";
import { PayoTransfer } from "../typechain-types";
import { TestToken } from "../typechain-types";
import { TestToken__factory } from "../typechain-types";

describe("PayoTransfer", function () {
  let owner: Signer;
  let PAYO: PayoTransfer;
  let tokenA: TestToken;
  let tokenB: TestToken;

  before(async function () {
    owner = (await ethers.getSigners())[0];
    let PayoTransferFactory = (await ethers.getContractFactory(
      "PayoTransfer"
    )) as PayoTransfer__factory;
    let TokenAFactory = (await ethers.getContractFactory("TestToken")) as TestToken__factory;
    let TokenBFactory = (await ethers.getContractFactory("TestToken")) as TestToken__factory;

    tokenA = (await TokenAFactory.deploy());
    tokenB = (await TokenBFactory.deploy());
    PAYO = (await PayoTransferFactory.deploy(
      (
        await ethers.getSigners()
      )[1].address
    ));
    await PAYO.addValidToken(tokenA.address);
    await tokenA.approve(PAYO.address, await tokenA.balanceOf((await ethers.getSigners())[0].address))

  });

  it("TransferToken", async function () {
    let amount = await tokenA.balanceOf((await ethers.getSigners())[0].address);
    await PAYO.transferToken(tokenA.address, (await ethers.getSigners())[2].address, amount);
    let balance = await tokenA.balanceOf((await ethers.getSigners())[2].address);
    let fee = await tokenA.balanceOf((await ethers.getSigners())[1].address);
    expect(balance).to.be.equal(ethers.utils.parseEther((100 - 100 / 100 * 2).toString()));
    expect(fee).to.be.equal(ethers.utils.parseEther((100 - 100 / 100 * 98).toString()));
  });
  it("TransferETH", async function () {
    let amount = { value: ethers.utils.parseEther("100") };
    await PAYO.transferETH((await ethers.getSigners())[2].address, amount);
    let balanceAfter = await ethers.provider.getBalance((await ethers.getSigners())[2].address);
    let fee = await ethers.provider.getBalance((await ethers.getSigners())[1].address);
    expect(balanceAfter).to.be.equal("10098000000000000000000");
    expect(fee).to.be.equal("10002000000000000000000");
  })
  it("TransferWrongToken", async function () {
    let amount = await tokenB.balanceOf((await ethers.getSigners())[0].address);
    try {
      await PAYO.transferToken(tokenA.address, (await ethers.getSigners())[2].address, amount);
    }
    catch (err) {
      expect(err).to.be.revertedWith("Unsupported token");
    }
  })
});