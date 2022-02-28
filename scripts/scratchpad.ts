import flatCache from "flat-cache";
import env from '../src/config/client';
import { Wallet } from '@ethersproject/wallet';
import { BytesLike, ethers } from 'ethers';

async function main() {
    let tokenID = Number(process.argv.slice(2)[0]);
    if(!(tokenID >= 1)) tokenID = 1;
    console.log(tokenID);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
