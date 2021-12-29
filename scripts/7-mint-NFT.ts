import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import keccak256 from 'ethers';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableMethodParams, ImmutableXClient, MintableERC721TokenType } from '@imtbl/imx-sdk';
import { BytesLike, ethers } from 'ethers';
import env from '../src/config/client';
import * as encUtils from 'enc-utils';
//import { loggerConfig } from './config/logging';

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);

const component = 'imx-bulk-mint-script';

const waitForTransaction = async (promise: Promise<string>) => {
    const txId = await promise;
    console.log(component, 'Waiting for transaction', {
      txId,
      etherscanLink: `${env.config.etherscanTxnUrl}${txId}`,
      alchemyLink: `${env.config.alchemyTxnUrl}${txId}`,
    });
    const receipt = await provider.waitForTransaction(txId);
    if (receipt.status === 0) {
      throw new Error('Transaction rejected');
    }
    console.log(component, 'Transaction Mined: ' + receipt.blockNumber);
    return receipt;
};

// export function signMintBodyPayload()
// {
//   const hash = keccak256(toUtf8Bytes(JSON.stringify(mintBodyPayload)));
//   const sig = deserializeSignature(await this.signer.signMessage(hash));
//   return encUtils.addHexPrefix(
//     encUtils.padLeft(sig.r.toString(16), 64) +
//     encUtils.padLeft(sig.s.toString(16), 64) +
//     encUtils.padLeft(sig.recoveryParam?.toString(16) || '', 2),
//   );
// }

(async (): Promise<void> => {
    const wallet = new Wallet(env.keys.privateKey as BytesLike)
    const minter = await ImmutableXClient.build({
      publicApiUrl: env.config.apiUrl as string,
      signer: wallet.connect(provider),
      starkContractAddress:  env.config.starkContractAddress as string,
      registrationContractAddress: env.config.registrationContractAddress as string,
      gasLimit: env.config.gasLimit as string,
      gasPrice: env.config.gasPrice as string,
      enableDebug: false
    } );

    // console.log(component, 'MINTER REGISTRATION');
    // const registerImxResult = await minter.registerImx({
    //   etherKey: minter.address.toLowerCase(),
    //   starkPublicKey: minter.starkPublicKey,
    // });

    // if (registerImxResult.tx_hash === '') {
    //   console.log(component, 'Minter registered, continuing...');
    // } else {
    //   console.log(component, 'Waiting for minter registration...');
    //   await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    // }

    const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
      {
        users: [{
          etherKey: env.keys.mintRecieverWallet.toLowerCase(),
          tokens: [{
                     id: "2",
                     blueprint: 'https://cloudflare-ipfs.com/ipfs/QmZmqruC9qZdBhdhzCTnFCiPpKGmmrS4i4QuiYT6CDQEhr/2',
                 }]
         }],
        contractAddress: env.scriptvars.collectionContractAddress.toLowerCase(),
      },
    ];

    const result = await minter.mintV2(payload);
    console.log(result);

})().catch((e) => {
    console.log(component, e);
    process.exit(1);
});