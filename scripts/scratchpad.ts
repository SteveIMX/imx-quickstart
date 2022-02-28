import flatCache from "flat-cache";
import env from '../src/config/client';
import { Wallet } from '@ethersproject/wallet';
import { BytesLike, ethers } from 'ethers';

async function main() {

    const { publicKeyCreate } = require('secp256k1')
    var publicKey = '0x' + Buffer.from(publicKeyCreate(Buffer.from(env.keys.privateKey, 'hex'), false)).toString('hex')
    console.log(publicKey)

}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
