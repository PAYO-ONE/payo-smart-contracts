import { ethers } from "hardhat";
import { PayoTransfer__factory } from "../typechain-types/factories/contracts/PayoTransfer__factory";

async function main() {
    
    let owner = (await ethers.getSigners())[0];
    
    let feeCollector = '0xC647fF03b209aF42341348012495b77e0B0FC114';

    const PayoTransferFactory = (await ethers.getContractFactory('PayoTransfer')) as PayoTransfer__factory;
    const PayoTransfer = await PayoTransferFactory.deploy(feeCollector, 100);
    await PayoTransfer.deployed();

    console.log(PayoTransfer.address);
    console.log(await owner.getAddress()); 
}

main();
