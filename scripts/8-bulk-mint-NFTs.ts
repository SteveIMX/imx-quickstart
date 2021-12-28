import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';
import { parse } from 'ts-command-line-args';
import { BytesLike } from 'ethers';

import env from '../src/config/client';
//import { loggerConfig } from './config/logging';

interface BulkMintScriptArgs {
  wallet: string;
  number: number;
}

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);
//const log: ImLogger = new WinstonLogger(loggerConfig);
const component = 'imx-bulk-mint-script';

const waitForTransaction = async (promise: Promise<string>) => {
  const txId = await promise;
//   log.info(component, 'Waiting for transaction', {
//     txId,
//     etherscanLink: `https://ropsten.etherscan.io/tx/${txId}`,
//     alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-ropsten/tx/${txId}`,
//   });
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  //log.info(component, `Transaction Mined: ${receipt.blockNumber}`);
  console.log(component, `Transaction Mined: ${receipt.blockNumber}`);
  return receipt;
};

(async (): Promise<void> => {
  const BULK_MINT_MAX = 3; //TODO: Why is this here?

  //TODO: What?? How is this doing anything and how is connected to the minter? How is number populated?
  const { wallet, number } = parse<BulkMintScriptArgs>({
    wallet: {
      type: String,
      alias: 'w',
      description: 'Wallet to receive minted NFTs',
    },
    number: {
      type: Number,
      alias: 'n',
      description: `Number of NFTS to mint. Maximum: ${BULK_MINT_MAX}`,
    },
  });

  if (number >= Number(BULK_MINT_MAX))
    throw new Error(`tried to mint too many tokens. Maximum ${BULK_MINT_MAX}`);

  const tokenId = parseInt("1", 10); //TODO: Hardcoded currently
  console.log('tokenId');
  console.log(tokenId);

  const minter = await ImmutableXClient.build({
    publicApiUrl: env.config.apiUrl as string,
    signer: new Wallet(env.keys.privateKey as BytesLike).connect(provider),
    starkContractAddress:  env.config.starkContractAddress as string,
    registrationContractAddress: env.config.registrationContractAddress as string,
    gasLimit: env.config.gasLimit as string,
    gasPrice: env.config.gasPrice as string,
    enableDebug: false
  } );

  log.info(component, 'MINTER REGISTRATION');
  const registerImxResult = await minter.registerImx({
    etherKey: minter.address.toLowerCase(),
    starkPublicKey: minter.starkPublicKey,
  });

  if (registerImxResult.tx_hash === '') {
    log.info(component, 'Minter registered, continuing...');
  } else {
    log.info(component, 'Waiting for minter registration...');
    await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
  }

  log.info(component, `OFF-CHAIN MINT ${number} NFTS`);

  const tokens = Array.from({ length: number }, (_, i) => i).map(i => ({
    id: (tokenId + i).toString(),
    blueprint: 'onchain-metadata',
  }));

  const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: env.tokenAddress, // NOTE: a mintable token contract is not the same as regular erc token contract
      users: [
        {
          etherKey: wallet.toLowerCase(),
          tokens,
        },
      ],
    },
  ];

  const result = await minter.mintV2(payload);
  console.log(result);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
