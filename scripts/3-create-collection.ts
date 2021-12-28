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

  // console.log('Verifying contract:'+env.scriptvars.collectionContractAddress);
  // // TODO better alternative to sleep plus catch the "Reason: Already Verified" error and return sucess
  // // See https://github.com/wighawag/hardhat-deploy/issues/220
  // await hre.run("verify:verify", {
  //     address: env.scriptvars.collectionContractAddress,
  //     constructorArguments: [
  //         env.keys.publicKey,
  //         env.collection.name,
  //         env.collection.symbol,
  //         env.config.registrationContractAddress
  //     ],
  // })

  //log.info(component, 'Creating collection...', collectionContractAddress);
  console.log(component, 'Creating collection...', env.scriptvars.collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: env.collection.name,
    // description: 'ENTER_COLLECTION_DESCRIPTION (OPTIONAL)',
    contract_address: env.scriptvars.collectionContractAddress,
    owner_public_key: env.keys.publicKey as string,
    // icon_url: '',
    // metadata_api_url: '',
    // collection_image_url: '',
    project_id: parseInt(env.scriptvars.collectionProjectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
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
