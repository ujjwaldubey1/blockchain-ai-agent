import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: "0.8.17",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Only include these if you have the environment variables set
    ...(process.env.RPC_URL && process.env.PRIVATE_KEY ? {
      mainnet: {
        url: process.env.RPC_URL,
        accounts: [process.env.PRIVATE_KEY]
      },
      sepolia: {
        url: process.env.RPC_URL,
        accounts: [process.env.PRIVATE_KEY]
      }
    } : {})
  }
};

export default config; 