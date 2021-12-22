import { getEnv } from '../libs/utils';
import flatCache from "flat-cache";

var cache = flatCache.load('.scriptOutputs',"./");
var COLLECTION_CONTRACT_ADDRESS = cache.getKey('COLLECTION_CONTRACT_ADDRESS');


export default {
  alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
  ethNetwork: getEnv('ETH_NETWORK'),
  client: {
    publicApiUrl: getEnv('MAINNET_API_URL'),
    starkContractAddress: getEnv('STARK_CONTRACT_ADDRESS'),
    registrationContractAddress: getEnv('REGISTRATION_ADDRESS'),
    gasLimit: getEnv('GAS_LIMIT'),
    gasPrice: getEnv('GAS_PRICE'),
  },
  // Bulk minting
  privateKey1: getEnv('DEPLOYER_ROPSTEN_PRIVATE_KEY'),
  tokenId: getEnv('TOKEN_ID'),
  tokenAddress: getEnv('TOKEN_ADDRESS'),
  bulkMintMax: getEnv('BULK_MINT_MAX'),
  // Onboarding
  ownerAccountPrivateKey: getEnv('DEPLOYER_ROPSTEN_PRIVATE_KEY'),
 
  collectionContractAddress: COLLECTION_CONTRACT_ADDRESS,
  collectionProjectId: getEnv('COLLECTION_PROJECT_ID'),
};
