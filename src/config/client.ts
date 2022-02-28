import flatCache from "flat-cache";
var cache = flatCache.load('.scriptOutputs',"./");

export function getNetworkEnv(name: string): string {
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

  console.log("Environment variable " + name + " not yet set");
  return "";
}

export default {
  config: {
    ethNetwork: getEnv('ETH_NETWORK'),
    gasLimit: getEnv('GAS_LIMIT'),
    gasPrice: getEnv('GAS_PRICE'),
    registrationContractAddress: getNetworkEnv('REGISTRATION_ADDRESS'),
    starkContractAddress: getNetworkEnv('STARK_CONTRACT_ADDRESS'),
    apiUrl: getNetworkEnv('API_URL'),
    etherscanTxnUrl: getNetworkEnv('ALCHEMY_TXN_URL'),
    alchemyTxnUrl: getNetworkEnv('ALCHEMY_TXN_URL')
  },
  keys: {
    alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
    etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    pinataApiKey: getEnv('PINATA_API_KEY'),
    pinataSecretKey: getEnv('PINATA_SECRET_KEY'),
    address: getNetworkEnv('MINTER_ADDRESS'),
    privateKey: getNetworkEnv('MINTER_PRIVATE_KEY'),
    mintRecieverWallet: getNetworkEnv('MINT_RECIEVER_WALLET')
  },
  collection: {
    name: getEnv('CONTRACT_NAME'),
    symbol: getEnv('CONTRACT_SYMBOL'),
    companyName: getEnv('COMPANY_NAME'),
    contactEmail: getEnv('CONTACT_EMAIL'),
    metadataJsonPath: getEnv('METADATA_JSON_PATH'),
    metadataApiUrl: getEnv('METADATA_API_URL'),
    collectionContractAddress: getEnv('COLLECTION_CONTRACT_ADDRESS'),
    collectionProjectId: getEnv('COLLECTION_PROJECT_ID')
  }
};
