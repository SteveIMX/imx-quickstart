import flatCache from "flat-cache";
import env from '../src/config/client';
import { Wallet } from '@ethersproject/wallet';
import { BytesLike, ethers } from 'ethers';

async function main() {
    // var cache = flatCache.load('.scriptOutputs',"./");
    // cache.setKey('asdf', "asdf345");
    // cache.save(true);
    console.log(env);
    const wallet = new Wallet(env.keys.privateKey as BytesLike)
    console.log(wallet.publicKey);
    //console.log('COLLECTION_CONTRACT_ADDRESS - before: ', process.env.COLLECTION_CONTRACT_ADDRESS);
    //process.env.COLLECTION_CONTRACT_ADDRESS = "0x5285cf2bc95B241Bb7b8e3A8d24aC84dC1BD7E1c";
    //console.log('COLLECTION_CONTRACT_ADDRESS - after: ', process.env.COLLECTION_CONTRACT_ADDRESS);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
