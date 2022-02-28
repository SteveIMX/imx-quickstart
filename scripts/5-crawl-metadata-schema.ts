import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import {
  AddMetadataSchemaToCollectionParams,
  ImmutableXClient,
  MetadataTypes,
} from '@imtbl/imx-sdk';
import { BytesLike } from 'ethers';

import env from '../src/config/client';
//import { loggerConfig } from '../src/config/logging';

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);
//const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-ADD-COLLECTION-METADATA-SCHEMA]';

(async (): Promise<void> => {

  const user = await ImmutableXClient.build({
    publicApiUrl: env.config.apiUrl as string,
    signer: new Wallet(env.keys.privateKey as BytesLike).connect(provider),
    starkContractAddress:  env.config.starkContractAddress as string,
    registrationContractAddress: env.config.registrationContractAddress as string,
    gasLimit: env.config.gasLimit as string,
    gasPrice: env.config.gasPrice as string,
    enableDebug: false
  } );

  console.log(
    component,
    'Adding metadata schema to collection',
    env.collection.collectionContractAddress,
  );

  /**
   * TODO: This should be from a file
   */
  const params: AddMetadataSchemaToCollectionParams = {
    metadata: [
      {
        name: "eco",
        type: MetadataTypes.Text
      },
      {
        name: "name",
        type: MetadataTypes.Text
      },
      {
        name: "pgn",
        type: MetadataTypes.Text
      },      
      {
        name: "FEN",
        type: MetadataTypes.Text
      },
      {
        name: "image_url",
        type: MetadataTypes.Text
      }
    ]
  };

  // "name": "1st NFT",
  // "description": "This is your 1st nft",
  // "image_url":"https://gateway.pinata.cloud/ipfs/QmabgDHUDQdmnAnrHDuq8YAxfFNdQo8V4PeUf9vBMe7v8B/1.jpeg",
  // "attack": 123,
  // "collectable": true,
  // "class": "EnumValue1" 	

  const collection = await user.addMetadataSchemaToCollection(
    env.collection.collectionContractAddress,
    params,
  );

  console.log(
    component,
    'Added metadata schema to collection',
    env.collection.collectionContractAddress,
  );
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  console.log(component, e);
  process.exit(1);
});
