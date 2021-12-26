import flatCache from "flat-cache";
var cache = flatCache.load('.scriptOutputs',"./");

export function getNetworkEnv(name: string): string | undefined {
  return getEnv(name = getEnv('ETH_NETWORK').toUpperCase() + "_" + name);
}
export function getEnv(name: string): string {
  //check proces.env set
  let value = process.env[name];
  if (Boolean(value)) return value as string;

  //check script set value in .scriptOutputs
  value = cache.getKey(name);
  if (Boolean(value)) return value as string;

  //check IMX default
  value = process.env["IMX_" + name];
  if (Boolean(value)) return value as string;

  console.log("Environment variable " + name + " not set");
  return "";
}

export default {
  config: {
    ethNetwork: getEnv('ETH_NETWORK'),
    gasLimit: getEnv('GAS_LIMIT'),
    gasPrice: getEnv('GAS_PRICE'),
    registrationContractAddress: getNetworkEnv('REGISTRATION_ADDRESS'),
    starkContractAddress: getNetworkEnv('STARK_CONTRACT_ADDRESS'),
    apiUrl: getNetworkEnv('API_URL')
  },
  keys: {
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    publicKey: getNetworkEnv('PUBLIC_KEY'),
    privateKey: getNetworkEnv('PRIVATE_KEY')
  },
  collection: {
    name: getEnv('CONTRACT_NAME'),
    symbol: getEnv('CONTRACT_SYMBOL'),
    company_name: getEnv('COMPANY_NAME'),
    contact_email: getEnv('CONTACT_EMAIL'),
  },
  scriptvars: {
    collectionContractAddress: getEnv('COLLECTION_CONTRACT_ADDRESS'),
    collectionProjectId: getEnv('COLLECTION_PROJECT_ID'),
    collectionId: getEnv('COLLECTION_ID')
  }
};
