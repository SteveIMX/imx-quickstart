import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, MintableERC721TokenType } from '@imtbl/imx-sdk';
import { BytesLike } from 'ethers';
import env from '../src/config/client';
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
    const minter = await ImmutableXClient.build({
      publicApiUrl: env.config.apiUrl as string,
      signer: new Wallet(env.keys.privateKey as BytesLike).connect(provider),
      starkContractAddress:  env.config.starkContractAddress as string,
      registrationContractAddress: env.config.registrationContractAddress as string,
      gasLimit: env.config.gasLimit as string,
      gasPrice: env.config.gasPrice as string,
      enableDebug: false
    } );

    console.log(component, 'MINTER REGISTRATION');
    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
      console.log(component, 'Minter registered, continuing...');
    } else {
      console.log(component, 'Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const result = await minter.mint({
      mints: [
        {
          etherKey: env.keys.mintRecieverWallet as string,
          tokens: [{
            type: MintableERC721TokenType.MINTABLE_ERC721,
            data: {
                tokenAddress: env.scriptvars.collectionContractAddress, // address of token
                id: "1", // must be a unique uint256 as a string
                blueprint: 'metadata', // metadata can be anything but your L1 contract must parse it on withdrawal from the blueprint format '{tokenId}:{metadata}'
            },
          }],
          nonce: '1',
          authSignature: '', // Leave empty
        },
      ],
    });
    console.log(result);
})().catch((e) => {
    console.log(component, e);
    process.exit(1);
});