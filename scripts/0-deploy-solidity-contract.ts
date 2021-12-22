import "@typechain/hardhat"; 
const hre = require("hardhat");
import { ethers, } from 'hardhat';
import { Contract, Signer } from 'ethers';
import flatCache from "flat-cache";

/**
 * main deploys a smart contract via a call to the deploySmartContract function. To
 * use this function please ensure your environment file (.env) is configured
 * with the correct values before invoking this script.
 */

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying Contracts with the account: ', deployer.address);
    console.log('Account Balance: ', (await deployer.getBalance()).toString());
    // Use any logic you want to determine these values
    const owner = process.env.CONTRACT_OWNER_ADDRESS;
    const name = process.env.CONTRACT_NAME;
    const symbol = process.env.CONTRACT_SYMBOL;

    // Hard coded to compile and deploy the Asset.sol smart contract.
    const SmartContract = await ethers.getContractFactory('Asset');
    const imxAddress = getIMXAddress(hre.network.name);
    const smartContract = await SmartContract.deploy(owner, name, symbol, imxAddress);
    console.log('Deployed Contract Address:', smartContract.address);
    var cache = flatCache.load('.scriptOutputs',"./");
    cache.setKey('COLLECTION_CONTRACT_ADDRESS', smartContract.address);
    cache.save();
    console.log('Verifying contract in 5 minutes...');
    await sleep(60000 * 5);
    // TODO capture the "Reason: Already Verified" error and return sucess
    await hre.run("verify:verify", {
        address: smartContract.address,
        constructorArguments: [
            owner,
            name,
            symbol,
            imxAddress
        ],
    })
}
function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Returns the IMX address for either network. DO NOT CHANGE these values.
 * @param {string} network - ropsten or mainnent
 * @returns {string} IMX address
 */
function getIMXAddress(network:string) {
    switch (network) {
        case 'ropsten':
            return '0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef';
        case 'mainnet':
            return '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9';
    }
    throw Error('Invalid network selected');
}
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
