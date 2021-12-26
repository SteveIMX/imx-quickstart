import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateProjectParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import flatCache from "flat-cache";

import env from '../src/config/client';
import { loggerConfig } from '../src/config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-PROJECT]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('DEPLOYER_ROPSTEN_PRIVATE_KEY');

  const signer = new Wallet(privateKey).connect(provider);

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating project...');

  /**
   * Edit your values here
   */
  const params: CreateProjectParams = {
    name: env.project_name,
    company_name: env.company_name,
    contact_email: env.contact_email,
  };

  let project;
  try {
    project = await user.createProject(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  var cache = flatCache.load('.scriptOutputs',"./");
  cache.setKey('COLLECTION_PROJECT_ID', project.id);
  cache.save();

  log.info(component, `Created project with ID: ${project.id}`);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
