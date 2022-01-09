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

    //BIG TODO
    // 1) Replace the metadataAPI with reference the IPFS hash of the JSON, could be as simple as setting jsonIPFSUrl = metadataApiUrl as step, need to allow for other metadata API options (e.g. Git)
    // 2) Check if NFT already minted
    // 3) Allow for multi-mint and eventually mint on demand
    const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
      {
        users: [{
          etherKey: env.keys.mintRecieverWallet.toLowerCase(),
          tokens: [{
                     id: "1",
                     blueprint: env.collection.metadataApiUrl + '/1',
                 }]
         }],
        contractAddress: env.collection.collectionContractAddress.toLowerCase(),
      },
    ];

    const result = await minter.mintV2(payload);
    console.log(result);
    console.log(`CONGRATULATIONS! Your first NFT has been minted: https://market.ropsten.x.immutable.com/assets/${env.collection.collectionContractAddress}/1`);

})().catch((e) => {
    console.log(component, e);
    process.exit(1);
});