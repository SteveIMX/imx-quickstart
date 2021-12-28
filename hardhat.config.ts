import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy-ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import env from './src/config/client';


//TODO: Figure out how to run from ts-node and use the /src/config/client env vars
// url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.IMX_ALCHEMY_API_KEY}}`,
// accounts: [`0x${process.env.IMX_ROPSTEN_PRIVATE_KEY}`],
// },
// ropsten: {
// url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.IMX_ALCHEMY_API_KEY}`,
// accounts: [`0x${process.env.IMX_ROPSTEN_PRIVATE_KEY}`],
// },
// mainnet: {
// url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.IMX_ALCHEMY_API_KEY}`,
// accounts: [`0x${process.env.IMX_ROPSTEN_PRIVATE_KEY}`],


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: env.config.ethNetwork,
  networks: {
    dev: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${env.keys.alchemyApiKey}`,
      accounts: [`0x${env.keys.privateKey}`],
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${env.keys.alchemyApiKey}`,
      accounts: [`0x${env.keys.privateKey}`],
    },
    mainnet: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${env.keys.alchemyApiKey}`,
      accounts: [`0x${env.keys.privateKey}`],
    },
  },
  typechain: {
    outDir: "artifacts/typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: env.keys.etherscanApiKey
  },
};
