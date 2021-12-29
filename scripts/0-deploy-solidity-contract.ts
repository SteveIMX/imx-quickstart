import hre from 'hardhat';
import "@nomiclabs/hardhat-waffle";
const ethers = hre.ethers;
import "@typechain/hardhat"; 
import "@nomiclabs/hardhat-ethers";
import flatCache from "flat-cache";
import env from '../src/config/client';

/**
 * main deploys a smart contract via a call to the deploySmartContract function. To
 * use this function please ensure your environment file (.env) is configured
 * with the correct values before invoking this script.
 */

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    hre.run('compile');
    
    console.log('Deploying Contracts with the account: ', deployer.address);
    console.log('Account Balance: ', (await deployer.getBalance()).toString());

    // Use any logic you want to determine these values
    const owner = env.keys.address;
    const name = env.collection.company_name;
    const symbol = env.collection.symbol;

    // Hard coded to compile and deploy the Asset.sol smart contract.
    const SmartContract = await  hre.ethers.getContractFactory('Asset');
    const imxAddress = env.config.starkContractAddress;

    const smartContract = await SmartContract.deploy(owner, name, symbol, imxAddress);

    console.log('Deployed Contract Address:', smartContract.address);

    //save deployed contract address to .scriptOutputs
    var cache = flatCache.load('.scriptOutputs',"./");
    cache.setKey('COLLECTION_CONTRACT_ADDRESS', smartContract.address);
    cache.save(true);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
