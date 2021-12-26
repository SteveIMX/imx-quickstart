import "@typechain/hardhat"; 
const hre = require("hardhat");
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import flatCache from "flat-cache";
import env from '../src/config/client';

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
    const owner = env.keys.publicKey;
    const name = env.collection.company_name;
    const symbol = env.collection.symbol;

    // Hard coded to compile and deploy the Asset.sol smart contract.
    const SmartContract = await ethers.getContractFactory('Asset');
    const imxAddress = env.config.starkContractAddress;

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

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
