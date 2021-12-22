import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy-ethers";
import dotenv from "dotenv";

dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    dev: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.DEPLOYER_ROPSTEN_PRIVATE_KEY}`],
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.DEPLOYER_ROPSTEN_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.DEPLOYER_MAINNET_PRIVATE_KEY}`],
    },
  },
  typechain: {
    outDir: "artifacts/typechain",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};

