import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImmutableMethodParams, ImmutableXClient, MintableERC721TokenType } from '@imtbl/imx-sdk';
import { BytesLike, ethers } from 'ethers';
import env from '../src/config/client';

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

    let tokenID = process.argv.slice(2)[0];
    if(!(Number(tokenID) >= 1)) tokenID = "1";
    const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
      {
        users: [{
          etherKey: env.keys.mintRecieverWallet.toLowerCase(),
          tokens: [{
                     id: tokenID,
                     blueprint: env.collection.metadataApiUrl + tokenID,
                 }]
         }],
        contractAddress: env.collection.collectionContractAddress.toLowerCase(),
      },
    ];

    const result = await minter.mintV2(payload);
    console.log(result);
    console.log(`CONGRATULATIONS! Your NFT has been minted: https://market.ropsten.x.immutable.com/assets/${env.collection.collectionContractAddress}/`+tokenID);

})().catch((e) => {
    console.log(component, e);
    process.exit(1);
});