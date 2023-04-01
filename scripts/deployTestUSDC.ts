import { ethers } from "hardhat";
import { TestToken__factory } from "../typechain-types/factories/contracts/TestToken__factory";

async function main() {
    
    let owner = (await ethers.getSigners())[0];
    

    const TestTokenFactory = (await ethers.getContractFactory('TestToken')) as TestToken__factory;
    const TestToken = await TestTokenFactory.deploy("0xe4091Ac67436733f1478BfCb95a0950ba5C42801");
    await TestToken.deployed();

    console.log(TestToken.address);
    console.log(await owner.getAddress()); 
}

main();
