import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateProjectParams, ImmutableXClient } from '@imtbl/imx-sdk';
import flatCache from "flat-cache";
import { BytesLike } from 'ethers';

import env from '../src/config/client';
//import { loggerConfig } from '../src/config/logging';

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);
//const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-PROJECT]';

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
  //log.info(component, 'Creating project...');
  console.log(component, 'Creating project...');

  /**
   * Collection params
   */
  const params: CreateProjectParams = {
    name: env.collection.name,
    company_name: env.collection.company_name,
    contact_email: env.collection.contact_email,
  };

  let project;
  try {
    project = await user.createProject(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  //save deployed contract address to .scriptOutputs
  var cache = flatCache.load('.scriptOutputs',"./");
  cache.setKey('COLLECTION_PROJECT_ID', project.id);
  cache.save(true);

  //log.info(component, `Created project with ID: ${project.id}`);
  console.log(component, `Created project with ID: ${project.id}`);
})().catch(e => {
  //log.error(component, e);
  console.log(component, e);
  process.exit(1);
});
