import hre from 'hardhat';
import "@nomiclabs/hardhat-waffle";
const ethers = hre.ethers;
import "@typechain/hardhat"; 
import "@nomiclabs/hardhat-ethers";
import { hardhatArguments, run } from "hardhat";
import { Mintable__factory } from "../artifacts/typechain";
import env from '../src/config/client';
import { BytesLike } from 'ethers';

async function main() {
    const address = env.scriptvars.collectionContractAddress;
    const tokenId = 1;
    const mintingBlob = getMintingBlob(1, 'test');
    const owner = env.keys.publicKey;

    const [wallet] = await ethers.getSigners();
    const contract = Mintable__factory.connect(address, wallet)

    const result = await contract.mintFor(owner as string, 1, mintingBlob as BytesLike);
    console.log(result);
    console.log(`CONGRATULATIONS! Your first NFT has been minted: https://market.ropsten.x.immutable.com/assets/${env.scriptvars.collectionContractAddress}/1`);
}

function getMintingBlob(tokenId: number, blueprint: string) {
    return ethers.utils.toUtf8Bytes(`{${tokenId.toString()}}:{${blueprint}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
