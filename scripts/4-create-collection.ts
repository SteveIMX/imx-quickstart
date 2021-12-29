import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { CreateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { BytesLike } from 'ethers';
import env from '../src/config/client';
import flatCache from "flat-cache";
import hre from 'hardhat';
import "@nomiclabs/hardhat-waffle";
const ethers = hre.ethers;
//import { loggerConfig } from '../src/config/logging';
//import { ImLogger, WinstonLogger } from '@imtbl/imlogging';

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);
//const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async (): Promise<void> => {
  const signer = new Wallet(env.keys.privateKey as BytesLike).connect(provider);

  const user = await ImmutableXClient.build({
    publicApiUrl: env.config.apiUrl as string,
    signer: new Wallet(env.keys.privateKey as BytesLike).connect(provider),
    starkContractAddress:  env.config.starkContractAddress as string,
    registrationContractAddress: env.config.registrationContractAddress as string,
    gasLimit: env.config.gasLimit as string,
    gasPrice: env.config.gasPrice as string,
    enableDebug: false
  } );

  console.log(component, 'Creating collection...', env.scriptvars.collectionContractAddress);

  const params: CreateCollectionParams = {
    name: env.collection.name,
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: env.scriptvars.collectionContractAddress,
    owner_public_key: env.keys.publicKey as string,
    // icon_url: '',
     metadata_api_url: 'https://gateway.pinata.cloud/ipfs/QmVBdHnu8NfqFP1J611A87iBRQ1S89jtkkSaD2iM1yikWq',  //TODO: Add the images and make this no longer hard coded
    // collection_image_url: '',
    project_id: parseInt(env.scriptvars.collectionProjectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    if(error.code="contract_address_invalid")
    {
      console.log("Contract not yet available, retrying in 3 minutes...");
      await sleep(60000 * 3);
      collection = await user.createCollection(params);
    }
    else
      throw new Error(JSON.stringify(error, null, 2));
  }

  var cache = flatCache.load('.scriptOutputs',"./");
  cache.setKey('COLLECTION_ID', collection.address);
  cache.save(true);

  //log.info(component, 'Created collection');
  console.log(component, 'Created collection');

  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  //log.error(component, e);
  console.log(component, e);
  process.exit(1);
});
