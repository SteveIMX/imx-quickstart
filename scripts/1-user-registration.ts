import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { BytesLike } from 'ethers';

import env from '../src/config/client';
//import { loggerConfig } from '../src/config/logging';

const provider = new AlchemyProvider(env.config.ethNetwork, env.keys.alchemyApiKey);
//const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-USER-REGISTRATION]';

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

  //log.info(component, 'Registering user...');
  console.log(component, 'Registering user...');

  let existingUser;
  let newUser;
  try {
    // Fetching existing user
    existingUser = await user.getUser({
      user: user.address,
    });
  } catch {
    try {
      // If user doesnt exist, create user
      newUser = await user.registerImx({
        etherKey: user.address,
        starkPublicKey: user.starkPublicKey,
      });
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
  }

  if (existingUser) {
    //log.info(component, 'User already exists', user.address);
    console.log(component, 'User already exists', user.address);
  } else {
    //log.info(component, 'User has been created', user.address);
    console.log(component, 'User has been created', user.address);
  }
  console.log(JSON.stringify({ newUser, existingUser }, null, 2));
})().catch(e => {
  //log.error(component, e);
  console.log(component, e);
  process.exit(1);
});
